import { BadRequestException, Injectable } from '@nestjs/common';

import { ReportRequestDto } from '../dto/report-request.dto';
import { ReportDefinition } from '../interfaces/report-definition.interface';

@Injectable()
export class ReportSecurityValidator {
  validate(report: ReportDefinition, request: ReportRequestDto): void {
    this.validateFilters(report, request);

    this.validateSorting(report, request);

    this.validateSearch(report, request);
  }

  private validateFilters(
    report: ReportDefinition,
    request: ReportRequestDto,
  ): void {
    const filters = request.filters ?? {};

    const allowedFilters = new Set(Object.keys(report.filterMappings ?? {}));

    const reservedFilters = ['dateFrom', 'dateTo'];

    for (const key of Object.keys(filters)) {
      if (reservedFilters.includes(key)) {
        continue;
      }

      if (!allowedFilters.has(key)) {
        throw new BadRequestException(
          `Filter '${key}' is not allowed for this report`,
        );
      }
    }
  }

  private validateSorting(
    report: ReportDefinition,
    request: ReportRequestDto,
  ): void {
    if (!request.sortBy) {
      return;
    }

    const allowedColumns = report.sortableColumns ?? [];

    const isAllowed = allowedColumns.some((column) => {
      const shortName = column.split('.').pop();

      return column === request.sortBy || shortName === request.sortBy;
    });

    if (!isAllowed) {
      throw new BadRequestException(
        `Sort column '${request.sortBy}' is not allowed`,
      );
    }
  }

  private validateSearch(
    report: ReportDefinition,
    request: ReportRequestDto,
  ): void {
    if (!request.search?.trim()) {
      return;
    }

    const searchableColumns = report.searchableColumns ?? [];

    if (searchableColumns.length === 0) {
      throw new BadRequestException('Search is not enabled for this report');
    }
  }
}
