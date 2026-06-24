import { IsIn } from 'class-validator';

export class ReportExportDto {
  @IsIn(['CSV', 'XLSX', 'PDF'])
  format: 'CSV' | 'XLSX' | 'PDF';
}
