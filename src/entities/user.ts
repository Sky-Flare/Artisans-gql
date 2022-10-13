import { IsEmail } from 'class-validator';
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';
import { Product } from './product';
import { Shop } from './shop';
import { Siren } from './siren';

export enum Role {
  ADMIN = 'admin',
  CLIENT = 'client',
  ARTISAN = 'artisan'
}
registerEnumType(Role, {
  name: 'Role'
});

@ObjectType()
@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public firstName!: string;

  @Field()
  @Column({ type: 'varchar' })
  public lastName!: string;

  @Field()
  @Column({ type: 'varchar' })
  public email!: string;

  @Field()
  @Column({ type: 'varchar' })
  public adress!: string;

  @Field()
  @Column({ type: 'integer' })
  public zipCode!: number;

  @Field()
  @Column({ type: 'varchar' })
  public city!: string;

  @Column({ type: 'varchar' })
  public password!: string;

  @Field()
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT
  })
  public role!: Role;

  @Field(() => [Shop], { nullable: true })
  @OneToMany(() => Shop, (shop) => shop.user)
  shops: Shop[] | undefined;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.user)
  products: Product[] | undefined;

  @OneToOne(() => Siren)
  @JoinColumn()
  siren: Siren | undefined;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}

@InputType({ description: 'New user data' })
export class CreateUserInput implements Partial<User> {
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

  @Field(() => Role)
  public role!: Role;

  @Field(() => String)
  public sirenNumber: string | undefined;
}
