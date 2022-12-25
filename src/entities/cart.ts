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

  @ManyToMany(() => Product, (product) => product.carts)
  @Field(() => [Product])
  @JoinTable({
    name: 'cart_product',
    joinColumn: {
      name: 'cartId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'productId',
      referencedColumnName: 'id'
    }
  })
  public products?: Product[];
}
