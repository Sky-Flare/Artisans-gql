import { Field, InputType, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Cart } from './cart';

import { Category_product } from '@entity/category_product';
import { Shop } from '@entity/shop';
import { Artisan } from '~/entities/artisan';

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public name!: string;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public description!: string;

  @Field({ nullable: false })
  @Column({ type: 'float' })
  public price!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public picture!: string;

  @Field()
  @Column({ type: 'integer', default: 1 })
  public enabled!: number;

  @Field(() => [Category_product], { nullable: true })
  @ManyToMany(() => Category_product, (cat) => cat.products)
  @JoinTable()
  public categoriesProducts!: Category_product[];

  @Field(() => [Shop], { nullable: true })
  @ManyToMany(() => Shop, (shop) => shop.products)
  shops?: Shop[];

  @ManyToMany(() => Cart, (cart) => cart.products)
  cart?: Cart[];

  @ManyToOne(() => Artisan, (artisan) => artisan.products)
  artisan!: Artisan;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}

@InputType({ description: 'New product data' })
export class CreateProductInput implements Partial<Product> {
  @Field()
  public name!: string;

  @Field()
  public description!: string;

  @Field()
  public price!: number;

  @Field(() => String, { nullable: false })
  public picture!: string;

  @Field(() => [Number], { nullable: true })
  public shopsIds?: number[];

  @Field(() => [Number], { nullable: true })
  public categoriesProductsIds?: number[];
}
