import { Field, InputType, ObjectType } from 'type-graphql';
import { ManyToMany } from 'typeorm';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
} from 'typeorm';
import { Product } from './product';
import { Shop } from './shop';

@ObjectType()
@Entity()
@Unique(['name'])
export class Category_product extends BaseEntity {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public name!: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  public picture?: string;

  @Field((type) => [Product], { nullable: true })
  @ManyToMany(() => Product, (product) => product.categoriesProducts)
  products: Product[] = [];

  @ManyToMany(() => Shop, (shop) => shop.categoriesProducts)
  shops: Shop[] = [];
}

@InputType({ description: 'New category product' })
export class CategoryProductInput {
  @Field()
  public name!: string;

  @Field({ nullable: true })
  public picture: string | undefined;
}
