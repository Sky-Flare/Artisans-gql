import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { Service } from 'typedi';
import { User } from '../../entities/User';
import { compare } from 'bcryptjs';
import { Field, ObjectType } from 'type-graphql';
import { sign } from 'jsonwebtoken';
import { MyContext } from '../myContext';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
@Service()
export class SignInResolver {
  @Mutation(() => LoginResponse, { nullable: true })
  async singIn(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
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
      accessToken: sign({ userId: user.id }, 'MySecretKey', {
        expiresIn: '15m',
      }),
    };
  }
}
