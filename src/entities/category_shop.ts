import { Field, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { Shop } from "./shop";

@ObjectType()
@Entity()
@Unique(["name"])
export class Category_shop extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field({ nullable: false })
  @Column({ type: "varchar" })
  public name!: string;

  @Field({ nullable: true })
  @Column({ type: "varchar", nullable: true })
  public picture?: string;

  @ManyToMany(() => Shop, (shop) => shop.categoriesShops)
  shops?: Shop[] | null;
}

@InputType({ description: "New category shop" })
export class CategoryShopInput {
  @Field()
  public name!: string;

  @Field(() => String, { nullable: true })
  public picture: string | undefined;
}

@InputType({ description: "Get shops by categories id & zip code " })
export class GetShopCatIdsAndZipCode {
  @Field(() => [Number], { nullable: true })
  public categoriesIds?: number[];

  @Field(() => Number, {
    nullable: true,
    description: "if null: zipCode user"
  })
  public zipcode?: number;
}
