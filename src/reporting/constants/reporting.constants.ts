export const REPORTING_CONSTANTS = {
  MODULE_NAME: 'REPORTING',

  DEFAULT_PAGE: 1,

  DEFAULT_PAGE_SIZE: 50,

  MAX_PAGE_SIZE: 1000,

  DEFAULT_SORT_DIRECTION: 'DESC',

  CACHE_PREFIX: 'report',

  DEFAULT_CACHE_TTL: 300, // 5 minutes

  METADATA_CACHE_TTL: 3600, // 1 hour

  REPORT_CACHE_TTL: 300,
} as const;

export const REPORT_CACHE_KEYS = {
  REPORT_DEFINITION: 'report-definition',
  REPORT_RESULT: 'report-result',
} as const;
