import axios from 'axios';
import { compare, hash } from 'bcryptjs';
import { Secret, sign } from 'jsonwebtoken';
import { Arg, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { CartRepository } from './../../repository/cart';

import { Artisan, CreateArtisanInput } from '@entity/artisan';
import { Client, CreateClientInput } from '@entity/client';
import { Role } from '@entity/generic/user';
import { Siren } from '@entity/siren';
import { AppDataSource } from '~/app-data-source';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken!: string;
}

const SirenRepository = AppDataSource.getRepository(Siren);
const ArtisanRepository = AppDataSource.getRepository(Artisan);
const ClientRepository = AppDataSource.getRepository(Client);

@Resolver()
@Service()
export class RegistrerResolvers {
  @Mutation(() => LoginResponse, { nullable: true })
  public async signUpArtisan(
    @Arg('input') inputData?: CreateArtisanInput
  ): Promise<LoginResponse | null> {
    const siren = SirenRepository.create({
      siren: inputData?.sirenNumber
    });

    if (!inputData) {
      throw new Error('Empty data');
    }

    if (!inputData.sirenNumber) {
      throw new Error('Siren requier');
    }

    await axios
      .get(
        `https://api.insee.fr/entreprises/sirene/V3/siren/${inputData.sirenNumber}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.JWT_SIREN}`,
            Accept: 'application/json'
          }
        }
      )
      .catch((e) => {
        throw new Error('Siren not found');
      });

    const artisan = ArtisanRepository.create({
      lastName: inputData.lastName,
      firstName: inputData.firstName,
      email: inputData.email,
      adress: inputData.adress,
      zipCode: inputData.zipCode,
      city: inputData.city,
      password: await hash(inputData.password, 13),
      role: Role.ARTISAN,
      siren: await SirenRepository.save(siren)
    });

    return await ArtisanRepository.save(artisan)
      .then(() => {
        return {
          accessToken: sign(
            { userId: artisan.id, role: artisan.role },
            process.env.JWT_SECRET as Secret,
            {
              expiresIn: '60m'
            }
          )
        };
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  @Mutation(() => LoginResponse, { nullable: true })
  public async signUpClient(
    @Arg('input') inputData?: CreateClientInput
  ): Promise<LoginResponse | null> {
    if (!inputData) {
      throw new Error('Empty data');
    }

    const cart = CartRepository.create({
      products: []
    });
    const client = ClientRepository.create({
      lastName: inputData.lastName,
      firstName: inputData.firstName,
      email: inputData.email,
      adress: inputData.adress,
      zipCode: inputData.zipCode,
      city: inputData.city,
      password: await hash(inputData.password, 13),
      role: Role.CLIENT,
      cart: await CartRepository.save(cart)
    });

    return await ClientRepository.save(client)
      .then(() => {
        return {
          accessToken: sign(
            { userId: client.id, role: client.role },
            process.env.JWT_SECRET as Secret,
            {
              expiresIn: '60m'
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
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('role') role: Role
  ): Promise<LoginResponse | null> {
    let user: Artisan | Client | null;
    if (role === Role.ARTISAN) {
      user = await Artisan.findOne({ where: { email } });
    } else {
      user = await Client.findOne({ where: { email } });
    }

    if (!user) {
      throw new Error('Bad credentials');
    }

    const verify = await compare(password, user.password);

    if (!verify) {
      throw new Error('Bad credentials');
    }

    return {
      accessToken: sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as Secret,
        {
          expiresIn: '15m'
        }
      )
    };
  }
}
