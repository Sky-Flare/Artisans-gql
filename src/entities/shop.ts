import { IsArray, IsInt, IsString } from 'class-validator';
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
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';
import { Horaire_shop } from './horaire_shop';

import { Artisan } from '@entity/artisan';
import { Category_product } from '@entity/category_product';
import { Category_shop } from '@entity/category_shop';
import { Product } from '@entity/product';
import { Siret } from '@entity/siret';
import { StatusModeration } from '@entity/generic/user';

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
  @Column({ type: 'varchar', length: 500 })
  public description!: string;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public address!: string;

  @Field({ nullable: false })
  @Column({ type: 'integer' })
  public zipCode!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public city!: string;

  @OneToOne(() => Siret)
  @JoinColumn()
  public siret!: Siret;

  @OneToMany(() => Horaire_shop, (hs) => hs.shop)
  @Field(() => [Horaire_shop], { nullable: true })
  public horaireShop?: Horaire_shop[];

  @Field()
  @Column({ type: 'integer', default: StatusModeration.PENDING })
  public enabled!: number;

  @Field(() => Artisan, { nullable: false })
  @ManyToOne(() => Artisan, (artisan) => artisan.shops)
  public artisan!: Artisan;

  @Field(() => [Category_shop], { nullable: false })
  @ManyToMany(() => Category_shop, (cat) => cat.shops)
  @JoinTable()
  public categoriesShops!: Category_shop[];

  @Field(() => [Category_product], { nullable: true })
  @ManyToMany(() => Category_product, (cat) => cat.shops)
  @JoinTable()
  public categoriesProducts?: Category_product[];

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
export class CreateShopInput {
  @IsString()
  @Field()
  public name!: string;

  @IsString()
  @Field()
  public description!: string;

  @IsString()
  @Field()
  public address!: string;

  @IsInt()
  @Field()
  public zipCode!: number;

  @IsString()
  @Field()
  public city!: string;

  @IsString()
  @Field()
  public siretNumber!: string;

  @IsArray()
  @Field(() => [Number])
  public shopCategoriesIds!: number[];
}
