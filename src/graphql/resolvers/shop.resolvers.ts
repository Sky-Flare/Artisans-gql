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
import { Siret } from '../../entities/siret';
import {
  GetShopCatIdsAndZipCode,
  Category_shop,
} from '../../entities/category_shop';
import { ShopRepository } from '../../repository/shop';
import { Category_shopRepository } from '../../repository/category_shop';
import { UserRepository } from '../../repository/user';

const SiretRepository = AppDataSource.getRepository(Siret);

@Resolver((of) => Shop)
@Service()
export class ShopResolvers {
  @Query(() => [Shop], { nullable: true })
  @Authorized()
  public async shops(
    @Ctx() ctx: MyContext,
    @Arg('filtersInput', { nullable: true })
    filtersInput?: GetShopCatIdsAndZipCode
  ): Promise<Shop[]> {
    let zipCodeSearch = filtersInput?.zipcode;
    if (!zipCodeSearch) {
      const me = await UserRepository.findOneBy({
        id: Number(ctx?.payload?.userId),
      });
      zipCodeSearch = me.zipCode;
    }
    if (!filtersInput?.categoriesIds) {
      return await ShopRepository.findByZipCode(zipCodeSearch);
    }
    return ShopRepository.findByCategoriesShopWithZipCode(
      zipCodeSearch,
      filtersInput.categoriesIds
    );
  }

  @FieldResolver()
  @Authorized()
  public async user(@Root() shop: Shop): Promise<User> {
    return await UserRepository.findUserOfShop(shop.id);
  }

  @FieldResolver({ description: 'All categories of a shop' })
  @Authorized()
  public async categories(@Root() shop: Shop): Promise<Category_shop[] | null> {
    if (!shop.id) {
      return [];
    }
    return await Category_shopRepository.findCategoryOfShop(shop.id);
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
      where: { id: Number(ctx?.payload?.userId) },
    });

    if (user?.role !== Role.ARTISAN) {
      throw new Error('Not authorized');
    }

    if (!createShopInput?.siretNumber) {
      throw new Error('Siren requier');
    }

    if (!createShopInput?.categoriesIds.length) {
      throw new Error('Category required');
    }

    const categories = await Category_shopRepository.findByCategoriesIds(
      createShopInput?.categoriesIds
    );

    if (!categories.length) {
      throw new Error('Category not found');
    }

    const siret = SiretRepository.create({
      siret: createShopInput.siretNumber,
    });

    // await axios
    //   .get(
    //     `https://api.insee.fr/entreprises/sirene/V3/siret/${createShopInput.siretNumber}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${process.env.JWT_SIREN}`,
    //         Accept: 'application/json',
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     if (res.data.etablissement.siren !== user.siren.siren) {
    //       throw new Error('not your establishment');
    //     }
    //     if (
    //       Number(
    //         res.data.etablissement.adresseEtablissement.codePostalEtablissement
    //       ) !== createShopInput.zipCode
    //     ) {
    //       throw new Error('not good zip code');
    //     }
    //   })
    //   .catch((e) => {
    //     throw new Error(`${e}`);
    //   });

    const shop = ShopRepository.create({
      name: createShopInput.name,
      description: createShopInput.city,
      adress: createShopInput.adress,
      zipCode: createShopInput.zipCode,
      city: createShopInput.city,
      user: user,
      siret: await SiretRepository.save(siret),
      categories: categories,
    });
    await ShopRepository.save(shop);
    return shop;
  }
}
