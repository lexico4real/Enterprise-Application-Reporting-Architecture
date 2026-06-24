import { Injectable } from '@nestjs/common';

import { ReportRegistry } from '../registry/report.registry';
import { ReportSqlBuilder } from '../builders/report-sql.builder';

import { ReportRequestDto } from '../dto/report-request.dto';
import { ReportResultDto } from '../dto/report-result.dto';

import { ReportQueryRepository } from '../repositories/report-query.repository';

import { ReportSecurityValidator } from '../validators/report-security.validator';

import { CacheKeyGenerator } from '../cache/cache-key.generator';

import { REPORTING_CONSTANTS } from '../constants/reporting.constants';
import { CacheService } from 'src/cache/cache.service';
import { ReportRequestValidator } from '../validators/validator';

@Injectable()
export class ReportEngineService {
  constructor(
    private readonly reportRegistry: ReportRegistry,
    private readonly requestValidator: ReportRequestValidator,
    private readonly securityValidator: ReportSecurityValidator,
    private readonly cacheKeyGenerator: CacheKeyGenerator,
    private readonly cacheService: CacheService,
    private readonly reportSqlBuilder: ReportSqlBuilder,
    private readonly reportQueryRepository: ReportQueryRepository,
  ) {}

  async generate(
    domain: string,
    reportName: string,
    request: ReportRequestDto,
  ): Promise<ReportResultDto> {
    /**
     * Step 1
     * Resolve metadata
     */
    const report = await this.reportRegistry.getReport(domain, reportName);

    /**
     * Step 2
     * Validate request
     */
    this.requestValidator.validate(request);

    /**
     * Step 3
     * Security validation
     */
    this.securityValidator.validate(report, request);

    /**
     * Step 4
     * Generate cache key
     */
    const cacheKey = this.cacheKeyGenerator.generate(report, request);

    /**
     * Step 5
     * Check cache
     */
    const cached = await this.cacheService.get<ReportResultDto>(cacheKey);

    if (cached) {
      return cached;
    }

    /**
     * Step 6
     * Build SQL
     */
    const query = this.reportSqlBuilder.build(report, request);

    /**
     * Step 7
     * Execute data query
     */
    const data = await this.reportQueryRepository.execute(query);

    /**
     * Step 8
     * Execute count query
     */
    const totalItems = await this.reportQueryRepository.count(query);

    /**
     * Step 9
     * Calculate pagination
     */
    const page = request.page ?? REPORTING_CONSTANTS.DEFAULT_PAGE;

    const pageSize = request.pageSize ?? REPORTING_CONSTANTS.DEFAULT_PAGE_SIZE;

    const totalPages = Math.ceil(totalItems / pageSize);

    /**
     * Step 10
     * Build result
     */
    const result: ReportResultDto = {
      reportName,

      currentPage: page,

      itemsPerPage: pageSize,

      totalItems,

      totalPages,

      filters: request.filters ?? {},

      generatedAt: new Date(),

      data,
    };

    /**
     * Step 11
     * Save cache
     */
    await this.cacheService.set(
      cacheKey,
      JSON.stringify(result),
      REPORTING_CONSTANTS.REPORT_CACHE_TTL,
    );

    /**
     * Step 12
     * Return
     */
    return result;
  }
}
