import { compare, hash } from 'bcryptjs';
import { Secret, sign } from 'jsonwebtoken';
import { Arg, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { Artisan, CreateArtisanInput } from '@entity/artisan';
import { Client, CreateClientInput } from '@entity/client';
import { ConnectUser, Role } from '@entity/generic/user';
import { Siren } from '@entity/siren';
import { ArtisanRepository } from '@repository/artisan';
import { GraphQLError } from 'graphql';
import { SirenRepository } from '@repository/siren';
import { ClientRepository } from '@repository/client';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken!: string;
}

@Resolver()
@Service()
export class RegistrerResolvers {
  private readonly artisanRepository: ArtisanRepository;
  private readonly sirenRepository: SirenRepository;
  private readonly clientRepository: ClientRepository;

  public constructor(
    artisanService: ArtisanRepository,
    sirenService: SirenRepository,
    clientRepository: ClientRepository
  ) {
    this.artisanRepository = artisanService;
    this.sirenRepository = sirenService;
    this.clientRepository = clientRepository;
  }
  @Mutation(() => LoginResponse, { nullable: true })
  public async signUpArtisan(
    @Arg('CreateArtisanInput') createArtisanInput: CreateArtisanInput
  ): Promise<LoginResponse | null> {
    const siren = this.sirenRepository.create({
      siren: createArtisanInput?.sirenNumber
    });
    if (
      await Siren.findOne({
        where: { siren: createArtisanInput.sirenNumber }
      })
    ) {
      throw new Error('Siren already use');
    }

    await this.sirenRepository
      .checkSiren(createArtisanInput.sirenNumber)
      .catch(() => {
        throw new Error('Siren not found');
      });

    const artisan = this.artisanRepository.create({
      lastName: createArtisanInput.lastName,
      firstName: createArtisanInput.firstName,
      email: createArtisanInput.email,
      address: createArtisanInput.address,
      zipCode: createArtisanInput.zipCode,
      city: createArtisanInput.city,
      password: await hash(createArtisanInput.password, 13),
      role: Role.ARTISAN,
      siren: await this.sirenRepository.save(siren)
    });

    return await this.artisanRepository
      .save(artisan)
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
    @Arg('CreateClientInput') createClientInput: CreateClientInput
  ): Promise<LoginResponse | null> {
    const client = this.clientRepository.create({
      lastName: createClientInput.lastName,
      firstName: createClientInput.firstName,
      email: createClientInput.email,
      address: createClientInput.address,
      zipCode: createClientInput.zipCode,
      city: createClientInput.city,
      password: await hash(createClientInput.password, 13),
      role: Role.CLIENT
    });

    return await this.clientRepository
      .save(client)
      .then(() => {
        return {
          accessToken: sign(
            { userId: client.id, role: client.role },
            process.env.JWT_SECRET as Secret,
            {
              expiresIn: '8h'
            }
          )
        };
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async signIn(
    @Arg('ConnectUser') { role, password, email }: ConnectUser
  ): Promise<LoginResponse | null> {
    let user: Artisan | Client | null;
    if (role === Role.ARTISAN) {
      user = await Artisan.findOne({ where: { email } });
    } else {
      user = await Client.findOne({ where: { email } });
    }

    if (!user) {
      throw new GraphQLError('Utilisateur non identifié', {
        extensions: {
          code: 'NOT_FOUND'
        }
      });
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
          expiresIn: '8h'
        }
      )
    };
  }
}
