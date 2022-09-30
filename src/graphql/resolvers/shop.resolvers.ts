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
import axios from 'axios';

import { Service } from 'typedi';
import { AppDataSource } from '../../app-data-source';
import { Shop, CreateShopInput } from '../../entities/shop';
import { Role, User } from '../../entities/user';
import { MyContext } from '../myContext';

const UserRepository = AppDataSource.getRepository(Shop);
const ShopRepository = AppDataSource.getRepository(Shop);

@Resolver((of) => Shop)
@Service()
export class ShopResolvers {
  @Query(() => [Shop])
  @Authorized()
  public async shops(): Promise<Shop[]> {
    return await ShopRepository.find({});
  }

  @FieldResolver()
  @Authorized()
  public async user(@Root() shop: Shop): Promise<User> {
    const currentShop = await ShopRepository.find({
      relations: {
        user: true,
      },
      where: {
        id: shop.id,
      },
    });
    return currentShop[0].user;
  }

  @Mutation(() => Shop, { nullable: true })
  @Authorized(Role.ARTISAN)
  public async createShop(
    @Ctx() ctx: MyContext,
    @Arg('createShopInput') createShopInput?: CreateShopInput
  ): Promise<Shop | null> {
    const user = await User.findOne({
      relations: {
        siren: true,
      },
      where: { id: Number(ctx.payload.userId) },
    });

    if (user.role !== Role.ARTISAN) {
      throw new Error('Not authorized');
    }

    if (!createShopInput.siret) {
      throw new Error('Siren requier');
    }

    await axios
      .get(
        `https://api.insee.fr/entreprises/sirene/V3/siret/${createShopInput.siret}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.JWT_SIREN}`,
            Accept: 'application/json',
          },
        }
      )
      .then((res) => {
        if (res.data.etablissement.siren !== user.siren.siren) {
          throw new Error('not your establishment');
        }
        if (
          Number(
            res.data.etablissement.adresseEtablissement.codePostalEtablissement
          ) !== createShopInput.zipCode
        ) {
          throw new Error('not good zip code');
        }
      })
      .catch((e) => {
        throw new Error(`${e}`);
      });

    const shop = ShopRepository.create({
      name: createShopInput.name,
      description: createShopInput.city,
      adress: createShopInput.adress,
      zipCode: createShopInput.zipCode,
      city: createShopInput.city,
      user: user,
      siret: createShopInput.siret,
    });
    await ShopRepository.save(shop);
    return shop;
  }
}
