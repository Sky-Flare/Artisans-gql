import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Product } from '@entity/product';

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field(() => [Product], { nullable: true })
  @ManyToMany(() => Product, (product) => product.cart)
  @JoinTable()
  public products?: Product[];
}
