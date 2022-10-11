import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToMany,
  ManyToOne,
  Unique,
  JoinTable,
} from 'typeorm';
import { Category_product } from './category_product';
import { Shop } from './shop';
import { User } from './user';

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field((_type) => Number)
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

  @Field((type) => [Category_product], { nullable: true })
  @ManyToMany(() => Category_product, (cat) => cat.products)
  @JoinTable()
  public categoriesProducts!: Category_product[];

  @ManyToMany(() => Shop, (shop) => shop.products)
  shops: Shop[] = [];

  @ManyToOne(() => User, (user) => user.products)
  user!: User;

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

  @Field()
  public picture!: string;

  @Field((type) => [Number], { nullable: true })
  public shopsIds?: number[];

  @Field((type) => [Number], { nullable: true })
  public categoriesProductsIds?: number[];
}
