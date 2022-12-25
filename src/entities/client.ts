import { IsEmail } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { ClientToProduct } from '@entity/clientToProduct';
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

  @OneToMany(() => ClientToProduct, (cTp) => cTp.client)
  public clientToProduct!: ClientToProduct[];
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
