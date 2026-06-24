import { Injectable } from '@nestjs/common';

import { ReportQuery } from '../interfaces/report-query.interface';
import { REPORTING_CONSTANTS } from '../constants/reporting.constants';

@Injectable()
export class PaginationBuilder {
  build(page?: number, pageSize?: number): ReportQuery {
    const currentPage =
      page && page > 0 ? page : REPORTING_CONSTANTS.DEFAULT_PAGE;

    const currentPageSize =
      pageSize && pageSize > 0
        ? pageSize
        : REPORTING_CONSTANTS.DEFAULT_PAGE_SIZE;

    const offset = (currentPage - 1) * currentPageSize;

    return {
      sql: 'LIMIT ? OFFSET ?',
      params: [currentPageSize, offset],
    };
  }
}
