import { Injectable, NotFoundException } from '@nestjs/common';

import { ReportDefinitionRepository } from '../repositories/report-definition.repository';
import { ReportDefinition } from '../interfaces/report-definition.interface';

@Injectable()
export class ReportRegistry {
  constructor(
    private readonly reportDefinitionRepository: ReportDefinitionRepository,
  ) {}

  async getReport(
    domain: string,
    reportName: string,
  ): Promise<ReportDefinition> {
    const report =
      await this.reportDefinitionRepository.findByDomainAndReportName(
        domain,
        reportName,
      );

    if (!report) {
      throw new NotFoundException(`Report not found: ${domain}/${reportName}`);
    }

    return report;
  }
}
