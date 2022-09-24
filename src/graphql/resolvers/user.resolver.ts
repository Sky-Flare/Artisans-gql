import {
  Resolver,
  Query,
  Mutation,
  Arg,
  UseMiddleware,
  Ctx,
  FieldResolver,
  Root,
  ResolverInterface,
} from 'type-graphql';
import { IsEmail, validate } from 'class-validator';

import { Service } from 'typedi';
import { AppDataSource } from '../../app-data-source';
import { User } from '../../entities/User';
import { CreateUserInput } from '../../entities/User';
import { hash } from 'bcryptjs';
import { isAuth } from '../middlewares/auth';
import { MyContext } from '../myContext';

const UserRepository = AppDataSource.getRepository(User);

@Resolver((of) => User)
@Service()
export class UserResolver {
  @Query(() => [User])
  @UseMiddleware(isAuth)
  public async users(): Promise<User[]> {
    return await UserRepository.find({});
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req) {
      return undefined;
    }

    return User.findOne({ where: { id: Number(ctx.payload.userId) } });
  }

  @Mutation(() => User)
  async updateUser(@Arg('id') id: number, @Arg('data') data: CreateUserInput) {
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error('User not found !');
    Object.assign(user, data);
    await user.save();
    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id') id: number) {
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error('User not found !');
    return await user
      .remove()
      .then(() => true)
      .catch(() => false);
  }
}
