import { Module } from '@nestjs/common';
import { ReportingService } from './services/reporting.service';
import { ReportingController } from './reporting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportDefinitionEntity } from './entities/report-definition.entity';
import { CacheService } from 'src/cache/cache.service';
import { ReportDefinitionRepository } from './repositories/report-definition.repository';
import { FilterBuilder } from './builders/filter.builder';
import { SearchBuilder } from './builders/search.builder';
import { SortingBuilder } from './builders/sorting.builder';
import { PaginationBuilder } from './builders/pagination.builder';
import { ReportSqlBuilder } from './builders/report-sql.builder';
import { ReportRequestValidator } from './validators/validator';
import { ReportQueryRepository } from './repositories/report-query.repository';
import { ReportRegistry } from './registry/report.registry';
import { ReportEngineService } from './services/report-engine.service';
import { ReportAuditService } from './services/report-audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReportDefinitionEntity])],
  controllers: [ReportingController],
  providers: [
    ReportDefinitionRepository,
    ReportingService,
    CacheService,
    FilterBuilder,
    SearchBuilder,
    SortingBuilder,
    PaginationBuilder,
    ReportSqlBuilder,
    ReportRequestValidator,
    ReportQueryRepository,
    ReportRegistry,
    ReportEngineService,
    ReportAuditService,
  ],
  exports: [ReportDefinitionRepository],
})
export class ReportingModule {}
