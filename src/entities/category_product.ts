import { IsArray, IsString } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';

import { Product } from '@entity/product';
import { Shop } from '@entity/shop';

@ObjectType()
@Entity()
@Unique(['name'])
export class Category_product extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public name!: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  public picture?: string;

  @ManyToMany(() => Product, (product) => product.categoriesProducts)
  products?: Product[];

  @Field(() => [Shop], { nullable: true })
  @ManyToMany(() => Shop, (shop) => shop.categoriesProducts)
  shops?: Shop[];
}

@InputType({ description: 'New category product' })
export class CategoryProductInput {
  @IsString()
  @Field()
  public name!: string;

  @Field(() => String, { nullable: true })
  public picture: string | undefined;

  @Field(() => [Number], { nullable: true })
  public shopsIds: number[] = [];
}

@InputType({ description: 'Update category product' })
export class CategoryProductUpdate {
  @IsArray()
  @Field(() => [Number], { nullable: true })
  public shopsIds?: number[] = [];

  @Field(() => Number)
  public categoryProductId!: number;
}
