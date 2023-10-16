import { Field, InputType, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';

import { Shop } from '@entity/shop';
import { IsArray, IsString } from 'class-validator';

@ObjectType()
@Entity()
@Unique(['name'])
export class Category_shop extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public name!: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  public picture?: string;

  @ManyToMany(() => Shop, (shop) => shop.categoriesShops)
  shops?: Shop[];
}

@InputType({ description: 'New category shop' })
export class CategoryShopInput {
  @IsString()
  @Field()
  public name!: string;

  @Field(() => String, { nullable: true })
  public picture?: string;
}

@InputType({ description: 'Get shops by categories id & zip code ' })
export class GetShopCatIdsAndZipCode {
  @IsArray()
  @Field(() => [Number], { nullable: true })
  public categoriesIds?: number[];

  @IsArray()
  @Field(() => [Number], {
    nullable: true,
    description: 'if null use zipCode user'
  })
  public zipcode?: number[];
}
