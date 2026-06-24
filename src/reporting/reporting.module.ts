import { Module } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportDefinitionEntity } from './entities/report-definition.entity';
import { CacheService } from 'src/cache/cache.service';
import { ReportDefinitionRepository } from './repositories/report-definition.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReportDefinitionEntity])],
  controllers: [ReportingController],
  providers: [ReportDefinitionRepository, ReportingService, CacheService],
  exports: [ReportDefinitionRepository],
})
export class ReportingModule {}
