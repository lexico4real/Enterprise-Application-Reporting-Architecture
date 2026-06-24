import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReportDefinitionEntity } from '../entities/report-definition.entity';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class ReportDefinitionRepository {
  constructor(
    @InjectRepository(ReportDefinitionEntity)
    private readonly repository: Repository<ReportDefinitionEntity>,

    private readonly cacheService: CacheService,
  ) {}

  async findByDomainAndReportName(
    domain: string,
    reportName: string,
  ): Promise<ReportDefinitionEntity> {
    const cacheKey = this.buildCacheKey(domain, reportName);

    const cached =
      await this.cacheService.get<ReportDefinitionEntity>(cacheKey);

    if (cached) {
      return cached;
    }

    const report = await this.repository.findOne({
      where: {
        domain,
        reportName,
      },
    });

    if (!report) {
      throw new NotFoundException(`Report not found: ${domain}/${reportName}`);
    }

    await this.cacheService.set(cacheKey, JSON.stringify(report), 3600);

    return report;
  }

  private buildCacheKey(domain: string, reportName: string): string {
    return `report-definition:${domain}:${reportName}`;
  }
}
