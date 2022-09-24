import { Resolver, Mutation, Arg } from 'type-graphql';

import { Service } from 'typedi';
import { AppDataSource } from '../../app-data-source';
import { User } from '../../entities/User';
import { CreateUserInput } from '../../entities/User';
import { hash } from 'bcryptjs';

@Resolver((of) => User)
@Service()
export class SignUpResolver {
  @Mutation((_type) => User)
  public async signUp(
    @Arg('input') inputData?: CreateUserInput
  ): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);
    const hashedPassword = await hash(inputData.password, 13);

    const user = userRepository.create({
      lastName: inputData.lastName,
      firstName: inputData.firstName,
      email: inputData.email,
      adress: inputData.adress,
      zipCode: inputData.zipCode,
      city: inputData.city,
      password: hashedPassword,
    });

    await userRepository.save(user);
    return user;
  }
}
