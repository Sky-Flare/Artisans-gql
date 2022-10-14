import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';

@Entity()
@Unique(['siret'])
export class Siret extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Column({ type: 'varchar' })
  public siret!: string;
}
