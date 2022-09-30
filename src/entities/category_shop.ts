import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
} from 'typeorm';

@ObjectType()
@Entity()
@Unique(['name'])
export class Category_shop extends BaseEntity {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public name!: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  public picture?: string;
}

@InputType({ description: ' New category shop' })
export class CategoryShopInput {
  @Field()
  public name!: string;

  @Field({ nullable: true })
  public picture: string;
}
