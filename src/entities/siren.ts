import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
} from 'typeorm';

@ObjectType()
@Entity()
@Unique(['siren'])
export class Siren extends BaseEntity {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public siren!: string;
}
