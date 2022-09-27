import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { Service } from 'typedi';
import { User, CreateUserInput } from '../../entities/user';
import { compare } from 'bcryptjs';
import { Field, ObjectType } from 'type-graphql';
import { sign } from 'jsonwebtoken';
import { AppDataSource } from '../../app-data-source';
import { hash } from 'bcryptjs';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
@Service()
export class RegistrerResolver {
  @Mutation(() => LoginResponse, { nullable: true })
  public async signUp(
    @Arg('input') inputData?: CreateUserInput
  ): Promise<LoginResponse | null> {
    const userRepository = AppDataSource.getRepository(User);

    const user = userRepository.create({
      lastName: inputData.lastName,
      firstName: inputData.firstName,
      email: inputData.email,
      adress: inputData.adress,
      zipCode: inputData.zipCode,
      city: inputData.city,
      password: await hash(inputData.password, 13),
    });
    return await userRepository
      .save(user)
      .then(() => {
        return {
          accessToken: sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '15m',
          }),
        };
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async singIn(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<LoginResponse | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Bad credentials');
    }

    const verify = await compare(password, user.password);

    if (!verify) {
      throw new Error('Bad credentials');
    }

    return {
      accessToken: sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
      }),
    };
  }
}
