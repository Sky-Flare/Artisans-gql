import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  ResolverInterface,
  Root
} from 'type-graphql';
import { Service } from 'typedi';

import { Artisan } from '@entity/artisan';
import { Category_product } from '@entity/category_product';
import { Category_shop, GetShopCatIdsAndZipCode } from '@entity/category_shop';
import { Role } from '@entity/generic/user';
import { Product } from '@entity/product';
import { CreateShopInput, Shop } from '@entity/shop';
import { Siret } from '@entity/siret';
import { ArtisanRepository } from '@repository/artisan';
import { Category_productRepository } from '@repository/category_product';
import { Category_shopRepository } from '@repository/category_shop';
import { ClientRepository } from '@repository/client';
import { ProductRepository } from '@repository/product';
import { ShopRepository } from '@repository/shop';
import { AppDataSource } from '~/app-data-source';
import { MyContext } from '~/graphql/myContext';

const SiretRepository = AppDataSource.getRepository(Siret);

@Resolver(() => Shop)
@Service()
export class ShopResolvers implements ResolverInterface<Shop> {
  @Query(() => [Shop], { nullable: true })
  @Authorized()
  public async shops(
    @Ctx() ctx: MyContext,
    @Arg('filtersInput', { nullable: true })
    filtersInput?: GetShopCatIdsAndZipCode
  ): Promise<Shop[] | null> {
    let zipCodeSearch = filtersInput?.zipcode;
    if (!zipCodeSearch) {
      if (ctx?.payload?.role === Role.ARTISAN) {
        const me = await ArtisanRepository.findOneBy({
          id: Number(ctx?.payload?.userId)
        });
        zipCodeSearch = me?.zipCode;
      } else {
        const me = await ClientRepository.findOneBy({
          id: Number(ctx?.payload?.userId)
        });
        zipCodeSearch = me?.zipCode;
      }
    }
    if (!filtersInput?.categoriesIds?.length && zipCodeSearch) {
      return ShopRepository.findByZipCode(zipCodeSearch);
    }
    if (zipCodeSearch && filtersInput?.categoriesIds) {
      return ShopRepository.findByCategoriesShopWithZipCode(
        zipCodeSearch,
        filtersInput?.categoriesIds
      );
    }
    return null;
  }

  @FieldResolver()
  @Authorized()
  public async artisan(@Root() shop: Shop): Promise<Artisan> {
    const artisan = await ArtisanRepository.findArtisanOfShop(shop.id);
    if (!artisan) {
      throw new Error('Artisan not found');
    }
    return artisan;
  }

  @FieldResolver({ description: 'All categories of a shop' })
  @Authorized()
  public async categoriesShops(@Root() shop: Shop): Promise<Category_shop[]> {
    const catShop = await Category_shopRepository.findCategoryOfShop(shop.id);
    if (!catShop) {
      throw new Error('Category shop not found');
    }
    return catShop;
  }

  @FieldResolver({ description: 'All categoriesProduct of a shop' })
  @Authorized()
  public async categoriesProducts(
    @Root() shop: Shop
  ): Promise<Category_product[] | undefined> {
    return await Category_productRepository.findCategoriesProductByShop(
      shop.id
    );
  }

  @FieldResolver({ description: 'All products of a shop' })
  @Authorized()
  public async products(@Root() shop: Shop): Promise<Product[] | undefined> {
    return await ProductRepository.findProductsOfShop(shop.id);
  }

  @Mutation(() => Shop, { nullable: true })
  @Authorized(Role.ARTISAN)
  public async createShop(
    @Ctx() ctx: MyContext,
    @Arg('createShopInput')
    createShopInput: CreateShopInput
  ): Promise<Shop | null> {
    const artisan = await Artisan.findOne({
      relations: {
        siren: true
      },
      where: { id: Number(ctx?.payload?.userId) }
    });

    if (artisan?.role !== Role.ARTISAN) {
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
      siret: createShopInput.siretNumber
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
      artisan: artisan,
      siret: await SiretRepository.save(siret),
      categoriesShops: categories
    });
    await ShopRepository.save(shop);
    return shop;
  }
}
