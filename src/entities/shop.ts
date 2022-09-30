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
@Unique(['siret'])
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

  @Field()
  @Column({ type: 'varchar' })
  public siret!: string;

  @Field()
  @Column({ type: 'integer', default: 1 })
  public enabled!: number;

  @Field((type) => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.shops)
  user: User;

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

  @Field()
  public siret!: string;
}
