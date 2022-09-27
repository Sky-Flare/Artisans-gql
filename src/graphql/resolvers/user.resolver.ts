import {
  Resolver,
  Query,
  Mutation,
  Arg,
  UseMiddleware,
  Ctx,
  Authorized,
} from 'type-graphql';

import { Service } from 'typedi';
import { AppDataSource } from '../../app-data-source';
import { User, CreateUserInput } from '../../entities/user';
import { MyContext } from '../myContext';

const UserRepository = AppDataSource.getRepository(User);

@Resolver((of) => User)
@Service()
export class UserResolver {
  @Query(() => [User])
  @Authorized('ADMIN')
  public async users(): Promise<User[]> {
    return await UserRepository.find({});
  }

  @Query(() => User, { nullable: true })
  @Authorized()
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.payload.userId) {
      return null;
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
