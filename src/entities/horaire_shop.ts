import { Shop } from '@entity/shop';
import { IsString } from 'class-validator';
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

export enum Days {
  'Monday' = 1,
  'Tuesday' = 2,
  'Wednesday' = 3,
  'Thursday' = 4,
  'Friday' = 5,
  'Saturday' = 6,
  'Sunday' = 7
}
registerEnumType(Days, {
  name: 'Days'
});

@ObjectType()
@Entity()
@Unique(['id'])
export class Horaire_shop extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @ManyToOne(() => Shop, (s) => s.horaireShop)
  public shop!: Shop;

  @Field({ nullable: false })
  @Column({ type: 'tinyint' })
  public dayId!: Days;

  @Field({ nullable: true })
  @Column({ type: 'time' })
  public timeAmStart!: string;

  @Field({ nullable: true })
  @Column({ type: 'time' })
  public timeAmEnd!: string;

  @Field({ nullable: true })
  @Column({ type: 'time' })
  public timePmStart!: string;

  @Field({ nullable: true })
  @Column({ type: 'time' })
  public timePmEnd!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}

@InputType()
export class InputHoraireShop {
  @IsString()
  @Field({ nullable: true })
  public timeAmStart!: string;

  @Field({ nullable: true })
  public timeAmEnd!: string;

  @Field({ nullable: true })
  public timePmStart!: string;

  @Field({ nullable: true })
  public timePmEnd!: string;

  @Field(() => Days, { nullable: true })
  public dayId!: Days;
}
