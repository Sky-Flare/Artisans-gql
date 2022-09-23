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

@ObjectType()
@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field()
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
  @Column({ type: 'varchar' })
  public zipCode!: string;

  @Field()
  @Column({ type: 'varchar' })
  public city!: string;

  @Field()
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
  public email!: string;

  @Field()
  public adress!: string;

  @Field()
  public zipCode!: string;

  @Field()
  public city!: string;

  @Field()
  public password!: string;
}
