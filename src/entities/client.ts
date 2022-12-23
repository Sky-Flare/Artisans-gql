import { IsEmail } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';

import { Role } from '~/entities/generic/user';
import { Cart } from './cart';
import { User } from './generic/user';

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

  @Field(() => [Cart], { nullable: true })
  @OneToOne(() => Cart)
  @JoinColumn()
  cart?: Cart;
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
  public adress!: string;

  @Field()
  public zipCode!: number;

  @Field()
  public city!: string;

  @Field()
  public password!: string;
}
