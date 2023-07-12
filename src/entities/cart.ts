import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql';
import { IsInt } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Client } from '@entity/client';
import { Product } from '@entity/product';

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public clientId!: number;

  @Field()
  @Column()
  public productId!: number;

  @Field()
  @Column()
  public quantity!: number;

  @ManyToOne(() => Client, (client) => client.cart)
  public client!: Client;

  @Field(() => Product, { nullable: true })
  @ManyToOne(() => Product, (product) => product.cart)
  public product!: Product;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}

export enum ActionCart {
  Add = 'add',
  Remove = 'remove'
}
registerEnumType(ActionCart, {
  name: 'ActionCart'
});

@InputType({ description: 'Cart client' })
export class UpdateCart implements Partial<Cart> {
  @IsInt()
  @Field()
  public productId!: number;

  @Field(() => ActionCart)
  public action!: ActionCart;
}
