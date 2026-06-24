import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('report_audits')
export class ReportAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  domain: string;

  @Column()
  reportName: string;

  @Column({ nullable: true })
  username?: string;

  @Column()
  executionTimeMs: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  filters?: Record<string, any>;

  @Column()
  status: string;

  @Column({
    nullable: true,
  })
  errorMessage?: string;

  @CreateDateColumn()
  executedAt: Date;
}
