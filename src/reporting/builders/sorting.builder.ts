import { Injectable } from '@nestjs/common';

import { ReportDefinition } from '../interfaces/report-definition.interface';
import { ReportQuery } from '../interfaces/report-query.interface';

@Injectable()
export class SortingBuilder {
  build(
    report: ReportDefinition,
    sortBy?: string,
    sortDirection: 'ASC' | 'DESC' = 'DESC',
  ): ReportQuery {
    if (!sortBy) {
      return {
        sql: '',
        params: [],
      };
    }

    const sortableColumns = report.sortableColumns ?? [];

    if (sortableColumns.length === 0) {
      return {
        sql: '',
        params: [],
      };
    }

    let targetColumn: string | undefined;

    for (const column of sortableColumns) {
      const shortName = column.split('.').pop();

      if (column === sortBy || shortName === sortBy) {
        targetColumn = column;
        break;
      }
    }

    if (!targetColumn) {
      return {
        sql: '',
        params: [],
      };
    }

    const direction = sortDirection === 'ASC' ? 'ASC' : 'DESC';

    return {
      sql: `ORDER BY ${targetColumn} ${direction}`,
      params: [],
    };
  }
}
