import { IsEmail } from 'class-validator';
import { Authorized, Field, InputType, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { Cart } from '@entity/cart';
import { Role, User } from '@entity/generic/user';

@ObjectType()
@Entity()
@Unique(['email'])
export class Client extends User {
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT
  })
  public role!: Role;

  @Authorized(Role.OWNER, Role.CLIENT)
  @Field()
  @Column({ type: 'varchar' })
  public email!: string;

  @Authorized(Role.OWNER, Role.CLIENT)
  @Field()
  @Column({ type: 'varchar' })
  public address!: string;

  @Authorized(Role.OWNER, Role.CLIENT)
  @Field()
  @Column({ type: 'integer' })
  public zipCode!: number;

  @Authorized(Role.OWNER, Role.CLIENT)
  @Field()
  @Column({ type: 'varchar' })
  public city!: string;

  @Field(() => [Cart], { nullable: true })
  @OneToMany(() => Cart, (cart) => cart.client)
  public cart!: Cart[];
}

@InputType({ description: 'New client data' })
export class CreateClientInput implements Partial<Client> {
  @Field()
  public lastName!: string;

  @Field()
  public firstName!: string;

  @Field()
  @IsEmail()
  public email!: string;

  @Field()
  public address!: string;

  @Field()
  public zipCode!: number;

  @Field()
  public city!: string;

  @Field()
  public password!: string;
}
