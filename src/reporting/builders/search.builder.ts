import { Injectable } from '@nestjs/common';

import { ReportDefinition } from '../interfaces/report-definition.interface';
import { ReportQuery } from '../interfaces/report-query.interface';

@Injectable()
export class SearchBuilder {
  build(report: ReportDefinition, search?: string): ReportQuery {
    if (!search?.trim()) {
      return {
        sql: '',
        params: [],
      };
    }

    const searchableColumns = report.searchableColumns ?? [];

    if (searchableColumns.length === 0) {
      return {
        sql: '',
        params: [],
      };
    }

    const likeClauses: string[] = [];
    const params: unknown[] = [];

    for (const column of searchableColumns) {
      likeClauses.push(`${column} LIKE ?`);

      params.push(`%${search}%`);
    }

    return {
      sql: `
        AND (
          ${likeClauses.join(' OR ')}
        )
      `,
      params,
    };
  }
}
