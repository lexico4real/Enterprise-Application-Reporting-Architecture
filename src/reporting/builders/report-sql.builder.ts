import { Injectable } from '@nestjs/common';

import { FilterBuilder } from './filter.builder';
import { SearchBuilder } from './search.builder';
import { SortingBuilder } from './sorting.builder';
import { PaginationBuilder } from './pagination.builder';

import { ReportDefinition } from '../interfaces/report-definition.interface';
import { ReportQuery } from '../interfaces/report-query.interface';
import { ReportRequestDto } from '../dto/report-request.dto';

@Injectable()
export class ReportSqlBuilder {
  constructor(
    private readonly filterBuilder: FilterBuilder,
    private readonly searchBuilder: SearchBuilder,
    private readonly sortingBuilder: SortingBuilder,
    private readonly paginationBuilder: PaginationBuilder,
  ) {}

  build(report: ReportDefinition, request: ReportRequestDto): ReportQuery {
    this.validateBaseQuery(report.baseQuery);

    const filterQuery = this.filterBuilder.build(report, request.filters);

    const searchQuery = this.searchBuilder.build(report, request.search);

    const sortingQuery = this.sortingBuilder.build(
      report,
      request.sortBy,
      request.sortDirection,
    );

    const paginationQuery = this.paginationBuilder.build(
      request.page,
      request.pageSize,
    );

    let sql = report.baseQuery.trim();

    sql += ' WHERE 1=1 ';

    sql += ` ${filterQuery.sql}`;

    sql += ` ${searchQuery.sql}`;

    if (report.groupByClause) {
      sql += ` GROUP BY ${report.groupByClause}`;
    }

    sql += ` ${sortingQuery.sql}`;

    sql += ` ${paginationQuery.sql}`;

    return {
      sql: sql.replace(/\s+/g, ' ').trim(),

      params: [
        ...filterQuery.params,
        ...searchQuery.params,
        ...paginationQuery.params,
      ],
    };
  }

  private validateBaseQuery(baseQuery: string): void {
    if (!baseQuery?.trim()) {
      throw new Error('Report base query cannot be empty');
    }

    const containsWhere = /\bwhere\b/i.test(baseQuery);

    if (containsWhere) {
      throw new Error('Base query must not contain WHERE clause');
    }
  }
}
