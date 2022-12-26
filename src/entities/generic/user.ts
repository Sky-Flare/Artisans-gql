import { IsEmail, IsString } from 'class-validator';
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  CLIENT = 'client',
  ARTISAN = 'artisan'
}
registerEnumType(Role, {
  name: 'Role'
});

@ObjectType()
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
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}

@InputType()
export class ConnectUser {
  @Field(() => Role)
  public role!: Role;

  @IsString()
  @Field()
  public password!: string;

  @IsEmail()
  @Field()
  public email!: string;
}
