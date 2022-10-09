import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
} from 'type-graphql';
import { Service } from 'typedi';

import { MyContext } from '../myContext';
import { AppDataSource } from '../../app-data-source';
import { Shop } from '../../entities/shop';
import { User, CreateUserInput } from '../../entities/user';

const UserRepository = AppDataSource.getRepository(User);
const ShopRepository = AppDataSource.getRepository(Shop);

@Resolver((of) => User)
@Service()
export class UserResolvers {
  @FieldResolver()
  @Authorized()
  public async shops(@Root() user: User): Promise<Shop[]> {
    return await ShopRepository.find({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  @Query(() => [User], { nullable: true, description: 'Return all users' })
  @Authorized()
  public async users(): Promise<User[]> {
    return await UserRepository.find({});
  }

  @Query(() => User, { nullable: true, description: 'Return on user' })
  @Authorized()
  public async user(
    @Arg('userId', { nullable: true }) userId?: number
  ): Promise<User> {
    return await UserRepository.findOneBy({
      id: userId,
    });
  }

  @Query(() => User, { nullable: true })
  @Authorized()
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    if (!ctx.payload?.userId) {
      return null;
    }
    return User.findOne({ where: { id: Number(ctx.payload.userId) } });
  }

  @Mutation(() => User)
  //todo : just if its me
  async updateUser(@Arg('id') id: number, @Arg('data') data: CreateUserInput) {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found !');
    }
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
