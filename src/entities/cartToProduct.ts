import { Cart } from '@entity/cart';
import { Product } from '@entity/product';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class CartToProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public cartId!: number;

  @Column()
  public productId!: number;

  @Column()
  public quantity!: number;

  @ManyToOne(() => Cart, (cart) => cart.cartToProducts)
  public cart!: Cart;

  @ManyToOne(() => Product, (product) => product.cartToProduct)
  public product!: Product;
}
