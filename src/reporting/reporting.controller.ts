import { Body, Controller, Param, Post } from '@nestjs/common';
import { ReportingService } from './services/reporting.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportRequestDto } from './dto/report-request.dto';
import { ReportResultDto } from './dto/report-result.dto';
import { ReportExportDto } from './dto/report-export.dto';

@Controller('reporting')
export class ReportingController {
  constructor(
    private readonly reportingService: ReportingService,
    private readonly reportExportService: ReportExportService,
  ) {}

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

  @Post(':domain/:reportName/export')
  @ApiOperation({ summary: 'Export report' })
  @ApiResponse({ status: 200, description: 'Report exported successfully' })
  exportReport(
    @Param('domain') domain: string,
    @Param('reportName') reportName: string,
    @Body() request: ReportExportDto,
  ): Promise<Buffer | string> {
    return this.reportExportService.export(domain, reportName, request);
  }
}
