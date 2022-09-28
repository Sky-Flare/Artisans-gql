import { Field, ObjectType, InputType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { User } from './user';

@ObjectType()
@Entity()
export class Shop extends BaseEntity {
  @Field((_type) => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public name!: string;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public description!: string;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public adress!: string;

  @Field({ nullable: false })
  @Column({ type: 'integer' })
  public zipCode!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar' })
  public city!: string;

  @ManyToOne(() => User, (user) => user.shops)
  user: number;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}

@InputType({ description: 'New shop data' })
export class CreateShopInput implements Partial<Shop> {
  @Field()
  public name!: string;

  @Field()
  public description!: string;

  @Field()
  public adress!: string;

  @Field()
  public zipCode!: number;

  @Field()
  public city!: string;
}
