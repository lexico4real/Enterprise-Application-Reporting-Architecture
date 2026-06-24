import { Injectable, Logger } from '@nestjs/common';

import { ReportAudit } from '../interfaces/report-audit.interface';

@Injectable()
export class ReportAuditService {
  private readonly logger = new Logger(ReportAuditService.name);

  audit(payload: ReportAudit): void {
    /**
     * Phase 1:
     * Log only
     *
     * Phase 2:
     * Persist to DB
     *
     * Phase 3:
     * Publish to Kafka
     */

    this.logger.log({
      event: 'REPORT_EXECUTION',
      ...payload,
    });
  }
}
