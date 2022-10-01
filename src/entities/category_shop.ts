import { Field, InputType, ObjectType } from 'type-graphql';
import { ManyToMany } from 'typeorm';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
} from 'typeorm';
import { Shop } from './shop';

@ObjectType()
@Entity()
@Unique(['name'])
export class Category_shop extends BaseEntity {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public name!: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  public picture?: string;

  @ManyToMany(() => Shop, (shop) => shop.categories)
  shops: Shop[];
}

@InputType({ description: 'New category shop' })
export class CategoryShopInput {
  @Field()
  public name!: string;

  @Field({ nullable: true })
  public picture: string;
}

@InputType({ description: 'Get shops by categories id & zip code ' })
export class GetShopCatIdsAndZipCode {
  @Field((type) => [Number], { nullable: true })
  public categoriesIds?: number[];

  @Field((type) => Number, {
    nullable: true,
    description: 'if null: zipCode user',
  })
  public zipcode?: number;
}
