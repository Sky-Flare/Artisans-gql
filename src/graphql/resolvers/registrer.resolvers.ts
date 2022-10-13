import { compare, hash } from "bcryptjs";
import { Secret, sign } from "jsonwebtoken";
import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { Service } from "typedi";
import { AppDataSource } from "../../app-data-source";
import { Siren } from "../../entities/siren";
import { CreateUserInput, Role, User } from "../../entities/user";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken!: string;
}

const SirenRepository = AppDataSource.getRepository(Siren);
const UserRepository = AppDataSource.getRepository(User);

@Resolver()
@Service()
export class RegistrerResolvers {
  @Mutation(() => LoginResponse, { nullable: true })
  public async signUp(
    @Arg("input") inputData?: CreateUserInput
  ): Promise<LoginResponse | null> {
    const isArtisant = inputData?.role === Role.ARTISAN;
    console.log(inputData);
    const siren = await SirenRepository.create({
      siren: inputData?.sirenNumber
    });
    console.log(siren);

    /*  if (isArtisant) {
      if (!inputData.sirenNumber) {
        throw new Error('Siren requier');
      }
      await axios
        .get(
          `https://api.insee.fr/entreprises/sirene/V3/siren/${inputData.sirenNumber}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.JWT_SIREN}`,
              Accept: 'application/json',
            },
          }
        )
        .catch(() => {
          throw new Error('Siren not found');
        });
    }
*/
    if (!inputData) {
      throw new Error("Empty data");
    }

    const user = UserRepository.create({
      lastName: inputData.lastName,
      firstName: inputData.firstName,
      email: inputData.email,
      adress: inputData.adress,
      zipCode: inputData.zipCode,
      city: inputData.city,
      password: await hash(inputData.password, 13),
      role: inputData.role,
      siren: isArtisant ? await SirenRepository.save(siren) : undefined
    });

    return await UserRepository.save(user)
      .then(() => {
        return {
          accessToken: sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET as Secret,
            {
              expiresIn: "60m"
            }
          )
        };
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async singIn(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<LoginResponse | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Bad credentials");
    }

    const verify = await compare(password, user.password);

    if (!verify) {
      throw new Error("Bad credentials");
    }

    return {
      accessToken: sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as Secret,
        {
          expiresIn: "15m"
        }
      )
    };
  }
}
