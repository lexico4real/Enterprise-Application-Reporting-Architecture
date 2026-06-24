import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

import { ReportRequestDto } from '../dto/report-request.dto';
import { ReportContext } from '../interfaces/report-context.interface';

@Injectable()
export class CacheKeyGenerator {
  generate(context: ReportContext, request: ReportRequestDto): string {
    const payload = {
      filters: this.sortObject(request.filters ?? {}),
      search: request.search,
      sortBy: request.sortBy,
      sortDirection: request.sortDirection,
      page: request.page,
      pageSize: request.pageSize,
    };

    const hash = createHash('sha256')
      .update(JSON.stringify(payload))
      .digest('hex');

    return ['report', context.domain, context.reportName, hash].join(':');
  }

  private sortObject(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sortObject(item));
    }

    if (value && typeof value === 'object') {
      return Object.keys(value as Record<string, unknown>)
        .sort()
        .reduce(
          (result, key) => {
            result[key] = this.sortObject(
              (value as Record<string, unknown>)[key],
            );

            return result;
          },
          {} as Record<string, unknown>,
        );
    }

    return value;
  }
}
