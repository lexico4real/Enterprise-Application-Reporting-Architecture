export interface ReportAudit {
  domain: string;
  reportName: string;
  username?: string;

  executionTimeMs: number;

  filters?: Record<string, any>;

  status: 'SUCCESS' | 'FAILED';

  errorMessage?: string;

  executedAt: Date;
}
