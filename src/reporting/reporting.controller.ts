import { Body, Controller, Param, Post } from '@nestjs/common';
import { ReportingService } from './services/reporting.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportRequestDto } from './dto/report-request.dto';
import { ReportResultDto } from './dto/report-result.dto';

@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Post(':domain/:reportName')
  @ApiOperation({ summary: 'Generate report' })
  @ApiResponse({ status: 200, description: 'Report generated successfully' })
  async generateReport(
    @Param('domain') domain: string,
    @Param('reportName') reportName: string,
    @Body() request: ReportRequestDto,
  ): Promise<ReportResultDto> {
    return this.reportingService.generateReport(domain, reportName, request);
  }
}
