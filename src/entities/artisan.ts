import { IsEmail } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Unique
} from 'typeorm';

import { Role, User } from '@entity/generic/user';
import { Product } from '@entity/product';
import { Shop } from '@entity/shop';
import { Siren } from '@entity/siren';

@ObjectType()
@Entity()
@Unique(['email'])
export class Artisan extends User {
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ARTISAN
  })
  public role!: Role;

  @Field(() => [Shop], { nullable: true })
  @OneToMany(() => Shop, (shop) => shop.artisan)
  shops?: Shop[];

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.artisan)
  products?: Product[];

  @OneToOne(() => Siren)
  @JoinColumn()
  siren?: Siren;
}

@InputType({ description: 'New artisan data' })
export class CreateArtisanInput implements Partial<Artisan> {
  @Field()
  public lastName!: string;

  @Field()
  public firstName!: string;

  @Field()
  @IsEmail()
  public email!: string;

  @Field()
  public adress!: string;

  @Field()
  public zipCode!: number;

  @Field()
  public city!: string;

  @Field()
  public password!: string;

  @Field(() => String)
  public sirenNumber: string | undefined;
}
