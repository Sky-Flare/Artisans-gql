import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartToProduct } from '~/entities/cartToProduct';

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @OneToMany(() => CartToProduct, (cartToProduct) => cartToProduct.cart)
  public cartToProducts!: CartToProduct[];
}
