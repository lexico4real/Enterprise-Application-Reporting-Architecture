# Reporting Engine

## Overview

This project implements a **metadata-driven reporting engine** that dynamically generates SQL queries at runtime. Instead of hardcoding report queries in application code, report definitions are stored in the database and interpreted by the application to produce flexible, filterable, searchable, sortable, and pageable reports.

This design allows new reports to be added or modified **without changing application code**, simply by updating report metadata.

---

## Architecture

The reporting engine follows a **dynamic SQL builder architecture** powered by database metadata.

```
Client Request
     ↓
ReportController
     ↓
ReportService
     ↓
ReportEngine
     ↓
ReportRegistry
     ↓
ReportProvider
     ↓
ReportDefinition (Database Metadata)
     ↓
ReportSqlBuilder
     ↓
ReportingRepository
     ↓
Database
```

---

## Key Components

### ReportController

Handles incoming HTTP requests and forwards them to the reporting service.

Example endpoint:

```
POST /backend/fma/reports/{domain}/{reportName}
```

Example request payload:

```json
{
  "filters": {
    "region": "PHC",
    "statuses": ["IN_PROGRESS"]
  },
  "page": 1,
  "pageSize": 10,
  "sortBy": "region",
  "sortDirection": "DESC"
}
```

---

### ReportRegistry

The registry manages all available `ReportProvider` implementations and retrieves report definitions based on the requested **domain** and **report name**.

```
domain → provider → report definition
```

Example:

```
fleet → FleetReportProvider → vehicle_request_running
```

---

### ReportProvider

Each domain implements a provider that supplies report definitions.

Example:

```
FleetReportProvider
```

Responsibilities:

* Define available reports for a domain
* Provide metadata used to build SQL queries

---

### ReportDefinition

Report definitions are stored in the database table:

```
fma_report_definitions
```

Example structure:

| Column             | Description                                         |
| ------------------ | --------------------------------------------------- |
| report_name        | Name of the report                                  |
| domain             | Report domain                                       |
| base_query         | Base SQL query                                      |
| filter_mappings    | JSON mapping of request filters to database columns |
| sortable_columns   | Allowed columns for sorting                         |
| searchable_columns | Columns used for search                             |
| group_by_clause    | Optional grouping                                   |
| date_column        | Column used for date filtering                      |

Example base query:

```sql
SELECT
    vr.request_id,
    vr.added_by_email,
    v.region,
    vr.status
FROM trip_requests vr
LEFT JOIN fma_app_vehicle_boat v
    ON vr.allocated_vehicle_id = v.id
```

Example filter mapping:

```json
{
  "region": "v.region",
  "driver": "vr.allocated_driver_id",
  "vehicle": "v.registration_no",
  "statuses": "vr.status"
}
```

---

## ReportSqlBuilder

`ReportSqlBuilder` dynamically constructs SQL queries based on:

* Base query
* Filters
* Search
* Sorting
* Pagination
* Grouping

Example generated SQL:

```sql
SELECT ...
FROM trip_requests vr
LEFT JOIN ...
WHERE 1=1
AND v.region = :region
AND vr.status IN (:statuses)
ORDER BY v.region DESC
LIMIT :limit OFFSET :offset
```

---

## Filtering

Filters are automatically mapped using the `filter_mappings` JSON configuration.

Example request:

```json
{
  "filters": {
    "region": "PHC",
    "statuses": ["IN_PROGRESS"]
  }
}
```

Generated SQL:

```sql
AND v.region = 'PHC'
AND vr.status IN ('IN_PROGRESS')
```

---

## Sorting

Sorting is restricted to columns defined in `sortable_columns` to prevent SQL injection.

Example request:

```
sortBy = region
sortDirection = DESC
```

Generated SQL:

```
ORDER BY v.region DESC
```

---

## Pagination

Pagination is automatically applied.

Example request:

```
page = 1
pageSize = 10
```

Generated SQL:

```
LIMIT 10 OFFSET 0
```

---

## Search

Search allows partial matching across configured columns.

Example request:

```
search = Lagos
```

Generated SQL:

```sql
AND (
    v.region LIKE '%Lagos%'
    OR vr.added_by_email LIKE '%Lagos%'
)
```

---

## Aggregated Reports

Some reports rely on **pre-aggregated tables** for performance optimization.

Example table:

```
vehicle_daily_utilization
```

A scheduled job periodically populates this table to avoid heavy calculations during report execution.

---

## Scheduled Aggregations

Example job:

```
FleetAggregationService.refreshVehicleUtilization()
```

This scheduled job computes metrics such as:

* Total trips per vehicle
* Total hours used
* Daily vehicle utilization

This significantly improves reporting performance.

---

## Example Reports

Fleet domain reports include:

```
vehicle_request_closed
vehicle_request_running
vehicle_request_running_overdue
vehicle_request_all
vehicle_request_pending_assignment
vehicle_request_turnaround_time
vehicle_utilization
driver_utilization
drivers_list
driver_license_renewal
vehicle_list_by_region
vehicles_by_department
bus_manifest
boat_manifest
fuel_records
incident_accident_report
```

## Summary

The reporting engine uses a **metadata-driven dynamic SQL builder** to generate flexible reports at runtime. By storing report definitions in the database and interpreting them through a generic query builder, the system enables scalable and maintainable reporting without requiring code changes for each new report.
