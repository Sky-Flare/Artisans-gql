import { IsEmail, IsString } from 'class-validator';
import {
  Authorized,
  Field,
  InputType,
  ObjectType,
  registerEnumType
} from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  ARTISAN = 'ARTISAN',
  OWNER = 'OWNER'
}
export enum StatusModeration {
  PENDING = 1,
  ACCEPTED = 2,
  REFUSED = 3
}

export function getStatusModeration(currentRole?: Role): StatusModeration[] {
  const statusMode = [StatusModeration.ACCEPTED];
  if (!currentRole) {
    return statusMode;
  }
  if (currentRole === Role.ADMIN || currentRole === Role.ARTISAN) {
    statusMode.push(StatusModeration.PENDING);
  }
  if (currentRole === Role.ADMIN) {
    statusMode.push(StatusModeration.REFUSED);
  }
  return statusMode;
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
