import { Injectable } from '@nestjs/common';

import { ReportDefinition } from '../interfaces/report-definition.interface';
import { ReportQuery } from '../interfaces/report-query.interface';

@Injectable()
export class FilterBuilder {
  build(
    report: ReportDefinition,
    filters?: Record<string, unknown>,
  ): ReportQuery {
    const sqlParts: string[] = [];

    const params: unknown[] = [];

    if (!filters) {
      return {
        sql: '',
        params,
      };
    }

    const mappings = report.filterMappings ?? {};

    for (const [filterKey, column] of Object.entries(mappings)) {
      const value = filters[filterKey];

      if (value === undefined || value === null) {
        continue;
      }

      if (typeof value === 'string' && value.trim() === '') {
        continue;
      }

      /**
       * IN (...)
       */
      if (Array.isArray(value) && value.length > 0) {
        const placeholders = value.map(() => '?').join(', ');

        sqlParts.push(`AND ${column} IN (${placeholders})`);

        params.push(...value);

        continue;
      }

      /**
       * Equality
       */
      sqlParts.push(`AND ${column} = ?`);

      params.push(value);
    }

    /**
     * Date Filters
     */
    if (report.dateColumn) {
      const dateFrom = filters.dateFrom;

      const dateTo = filters.dateTo;

      if (dateFrom) {
        sqlParts.push(`AND ${report.dateColumn} >= ?`);

        params.push(dateFrom);
      }

      if (dateTo) {
        sqlParts.push(`AND ${report.dateColumn} <= ?`);

        params.push(dateTo);
      }
    }

    return {
      sql: sqlParts.join(' '),
      params,
    };
  }
}
