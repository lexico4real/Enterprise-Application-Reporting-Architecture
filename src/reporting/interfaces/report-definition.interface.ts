export interface ReportDefinition {
  id: number;

  domain: string;

  reportName: string;

  baseQuery: string;

  groupByClause?: string | null;

  dateColumn?: string | null;

  sortableColumns?: string[];

  searchableColumns?: string[];

  filterMappings?: Record<string, string>;

  cacheable?: boolean;

  cacheTtl?: number;
}
