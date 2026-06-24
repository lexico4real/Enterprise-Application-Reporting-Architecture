import { IsInt, IsObject, IsString } from 'class-validator';

export class ReportResultDto {
  @IsString()
  reportName: string;

  @IsInt()
  currentPage: number;

  @IsInt()
  itemsPerPage: number;

  @IsInt()
  totalItems: number;

  @IsInt()
  totalPages: number;

  @IsObject()
  filters: Record<string, any>;

  @IsDate()
  generatedAt: Date;

  @IsObject({ each: true })
  data: Record<string, any>[];
}
