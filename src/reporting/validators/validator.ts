import { BadRequestException, Injectable } from '@nestjs/common';

import { ReportRequestDto } from '../dto/report-request.dto';
import { REPORTING_CONSTANTS } from '../constants/reporting.constants';

@Injectable()
export class ReportRequestValidator {
  validate(request: ReportRequestDto): void {
    this.validateRequiredFields(request);

    this.validatePagination(request);

    this.validateDateRange(request);
  }

  private validateRequiredFields(request: ReportRequestDto): void {
    if (!request) {
      throw new BadRequestException('Report request is required');
    }
  }

  private validatePagination(request: ReportRequestDto): void {
    if (request.pageSize > REPORTING_CONSTANTS.MAX_PAGE_SIZE) {
      throw new BadRequestException(
        `Page size cannot exceed ${REPORTING_CONSTANTS.MAX_PAGE_SIZE}`,
      );
    }

    if (request.page && request.page < 1) {
      throw new BadRequestException('Page must be greater than zero');
    }
  }

  private validateDateRange(request: ReportRequestDto): void {
    const filters = request.filters ?? {};

    const dateFrom = filters.dateFrom;

    const dateTo = filters.dateTo;

    if (!dateFrom || !dateTo) {
      return;
    }

    const from = new Date(String(dateFrom));

    const to = new Date(String(dateTo));

    if (from > to) {
      throw new BadRequestException('dateFrom cannot be after dateTo');
    }
  }
}
