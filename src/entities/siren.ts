import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";

@ObjectType()
@Entity()
@Unique(["siren"])
export class Siren extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field(() => String, { nullable: false })
  @Column({ type: "varchar" })
  public siren!: string;
}
