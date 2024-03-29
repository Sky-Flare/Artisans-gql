import { IsArray, IsString } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Artisan } from '@entity/artisan';
import { Category_product } from '@entity/category_product';
import { Shop } from '@entity/shop';
import { Cart } from '@entity/cart';
import { StatusModeration } from '@entity/generic/user';

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
  @Column({ type: 'varchar', length: 500 })
  public description!: string;

  @Field({ nullable: false })
  @Column({ type: 'float' })
  public price!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public picture!: string;

  @Field()
  @Column({ type: 'integer', default: StatusModeration.PENDING })
  public enabled!: number;

  @Field(() => [Category_product], { nullable: true })
  @ManyToMany(() => Category_product, (cat) => cat.products)
  @JoinTable()
  public categoriesProducts!: Category_product[];

  @Field(() => [Shop], { nullable: true })
  @ManyToMany(() => Shop, (shop) => shop.products)
  shops?: Shop[];

  @OneToMany(() => Cart, (cart) => cart.product)
  public cart!: Cart[];

  @ManyToOne(() => Artisan, (artisan) => artisan.products)
  artisan!: Artisan;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}

@InputType({ description: 'New product data' })
export class CreateProductInput implements Partial<Product> {
  @IsString()
  @Field(() => String)
  public name!: string;

  @Field(() => String)
  public description!: string;

  @Field(() => Number)
  public price!: number;

  @Field(() => String, { nullable: false })
  public picture!: string;

  @Field(() => [Number], { nullable: true })
  public shopsIds?: number[];

  @Field(() => [Number], { nullable: true })
  public categoriesProductsIds?: number[];
}

@InputType({ description: 'Update product data' })
export class UpdateProductInput extends CreateProductInput {
  @Field(() => Number)
  public productId!: number;
}

@InputType({ description: 'Get products filters' })
export class ProductsFilters {
  @Field(() => Number)
  public shopId!: number;

  @IsArray()
  @Field(() => [Number], {
    nullable: true
  })
  public categoriesProductsIds?: number[];
}
