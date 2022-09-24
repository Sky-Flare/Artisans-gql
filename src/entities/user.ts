import { Field, ObjectType, InputType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { IsEmail, validate } from 'class-validator';

@ObjectType()
@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @Field((_type) => Number)
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
}
