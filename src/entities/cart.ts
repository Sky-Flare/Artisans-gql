import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Product } from '@entity/product';
import { User } from '@entity/user';

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.shops)
  public user!: User;

  @Field(() => [Product], { nullable: true })
  @ManyToMany(() => Product, (product) => product.shops)
  @JoinTable()
  public products?: Product[];
}
