import { Field, InputType, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

import { Category_product } from '@entity/category_product';
import { Category_shop } from '@entity/category_shop';
import { Product } from '@entity/product';
import { Siret } from '@entity/siret';
import { User } from '@entity/user';

@ObjectType()
@Entity()
@Unique(['siret'])
export class Shop extends BaseEntity {
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
  @Column({ type: 'varchar' })
  public adress!: string;

  @Field({ nullable: false })
  @Column({ type: 'integer' })
  public zipCode!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public city!: string;

  @OneToOne(() => Siret)
  @JoinColumn()
  public siret!: Siret;

  @Field()
  @Column({ type: 'integer', default: 1 })
  public enabled!: number;

  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.shops)
  public user!: User;

  @Field(() => [Category_shop], { nullable: false })
  @ManyToMany(() => Category_shop, (cat) => cat.shops)
  @JoinTable()
  public categoriesShops!: Category_shop[];

  @Field(() => [Category_product], { nullable: true })
  @ManyToMany(() => Category_product, (cat) => cat.shops)
  @JoinTable()
  public categoriesProducts?: Category_product[];

  @Field(() => [Product], { nullable: true })
  @ManyToMany(() => Product, (product) => product.shops)
  @JoinTable()
  public products?: Product[];

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}

@InputType({ description: 'New shop data' })
export class CreateShopInput implements Partial<Shop> {
  @Field()
  public name!: string;

  @Field()
  public description!: string;

  @Field()
  public adress!: string;

  @Field()
  public zipCode!: number;

  @Field()
  public city!: string;

  @Field()
  public siretNumber!: string;

  @Field(() => [Number])
  public categoriesIds!: number[];
}
