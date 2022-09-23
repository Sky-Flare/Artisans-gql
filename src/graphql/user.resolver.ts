import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Service } from 'typedi';
import { AppDataSource } from '../app-data-source';
import { User } from '../entities/User';
import { CreateUserInput } from '../entities/User';

const UserRepository = AppDataSource.getRepository(User);

@Resolver()
@Service()
export class UserResolver {
  @Query(() => [User])
  public async users(): Promise<User[]> {
    return await UserRepository.find({});
  }

  @Mutation((_type) => User)
  public async createUser(
    @Arg('input') inputData?: CreateUserInput
  ): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({
      lastName: inputData.lastName,
      firstName: inputData.firstName,
      email: inputData.email,
      adress: inputData.adress,
      zipCode: inputData.zipCode,
      city: inputData.city,
      password: inputData.password,
    });
    await userRepository.save(user);
    return user;
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
