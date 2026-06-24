import { ForbiddenException, Injectable } from '@nestjs/common';

import { ReportEngineService } from './report-engine.service';

import { ReportRequestDto } from '../dto/report-request.dto';
import { ReportResultDto } from '../dto/report-result.dto';

@Injectable()
export class ReportingService {
  constructor(private readonly reportEngine: ReportEngineService) {}

  async generateReport(
    domain: string,
    reportName: string,
    request: ReportRequestDto,
    user?: any,
  ): Promise<ReportResultDto> {
    this.applyAuthorization(domain, reportName, request, user);

    this.applyBusinessRules(request, user);

    return this.reportEngine.generate(domain, reportName, request);
  }

  private applyAuthorization(
    domain: string,
    reportName: string,
    request: ReportRequestDto,
    user?: any,
  ): void {
    /**
     * Placeholder
     *
     * Implement application-specific authorization here.
     */

    if (!user) {
      return;
    }

    /**
     * Example:
     *
     * if (!user.permissions.includes('REPORT_VIEW')) {
     *   throw new ForbiddenException(
     *     'You are not authorized to view reports',
     *   );
     * }
     */
  }

  private applyBusinessRules(request: ReportRequestDto, user?: any): void {
    /**
     * Example:
     *
     * Dispatcher region enforcement
     */

    if (!user) {
      return;
    }

    if (user.role !== 'DISPATCHER') {
      return;
    }

    const assignedRegion = user.assignedRegion;

    if (!assignedRegion) {
      throw new ForbiddenException('Dispatcher region assignment is required');
    }

    request.filters ??= {};

    const requestedRegion = request.filters.region;

    if (requestedRegion && requestedRegion !== assignedRegion) {
      throw new ForbiddenException(
        'You are not authorized to view other regions',
      );
    }

    request.filters.region = assignedRegion;
  }
}
