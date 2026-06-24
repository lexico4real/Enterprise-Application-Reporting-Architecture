import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ReportQuery } from '../interfaces/report-query.interface';

@Injectable()
export class ReportQueryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async execute(query: ReportQuery): Promise<Record<string, unknown>[]> {
    return this.dataSource.query(query.sql, query.params);
  }

  async count(query: ReportQuery): Promise<number> {
    const countSql = this.buildCountQuery(query.sql);

    const result = await this.dataSource.query(
      countSql,
      query.params.slice(0, query.params.length - 2),
    );

    return Number(result?.[0]?.total ?? 0);
  }

  private buildCountQuery(sql: string): string {
    const withoutPagination = sql
      .replace(/LIMIT\s+\?\s+OFFSET\s+\?/gi, '')
      .replace(/ORDER\s+BY[\s\S]*?(?=(LIMIT|$))/i, '');

    return `
      SELECT COUNT(*) AS total
      FROM (
        ${withoutPagination}
      ) report_count
    `;
  }
}
