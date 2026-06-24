import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('report_definitions')
@Index(['domain', 'reportName'], { unique: true })
export class ReportDefinitionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  domain: string;

  @Column({
    length: 150,
  })
  reportName: string;

  @Column({
    type: 'text',
  })
  baseQuery: string;

  @Column({
    nullable: true,
  })
  groupByClause?: string;

  @Column({
    nullable: true,
  })
  dateColumn?: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  sortableColumns?: string[];

  @Column({
    type: 'json',
    nullable: true,
  })
  searchableColumns?: string[];

  @Column({
    type: 'json',
    nullable: true,
  })
  filterMappings?: Record<string, string>;

  @Column({
    default: true,
  })
  cacheable: boolean;

  @Column({
    default: 300,
  })
  cacheTtl: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
