import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
@Entity()
@Unique(['siren'])
export class Siren extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Column({ type: 'varchar' })
  public siren!: string;
}
