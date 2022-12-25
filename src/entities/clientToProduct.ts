import { Client } from '@entity/client';
import { Product } from '@entity/product';
import { IsInt } from 'class-validator';
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@ObjectType()
@Entity()
export class ClientToProduct extends BaseEntity {
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

  @ManyToOne(() => Client, (client) => client.clientToProduct)
  public client!: Client;

  @ManyToOne(() => Product, (product) => product.clientToProduct)
  public product!: Product;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}

export enum ActionClientToProduct {
  Add = 'add',
  Remove = 'remove'
}
registerEnumType(ActionClientToProduct, {
  name: 'ActionClientToProduct'
});

@InputType({ description: 'New artisan data' })
export class UpdateClientToProduct implements Partial<ClientToProduct> {
  @IsInt()
  @Field()
  public productId!: number;

  @Field(() => ActionClientToProduct)
  public action!: ActionClientToProduct;
}
