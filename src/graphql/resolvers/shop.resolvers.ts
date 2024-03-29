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
import { Horaire_shop } from '@entity/horaire_shop';

import { Artisan } from '@entity/artisan';
import { Category_product } from '@entity/category_product';
import { Category_shop, GetShopCatIdsAndZipCode } from '@entity/category_shop';
import { Role, StatusModeration } from '@entity/generic/user';
import { InputHoraireShop } from '@entity/horaire_shop';
import { CreateShopInput, Shop } from '@entity/shop';
import { ArtisanRepository } from '@repository/artisan';
import { Category_productRepository } from '@repository/category_product';
import { Category_shopRepository } from '@repository/category_shop';
import { ClientRepository } from '@repository/client';
import { ProductRepository } from '@repository/product';
import { ShopRepository } from '@repository/shop';
import { MyContext } from '@src/graphql/myContext';
import { HoraireShopRepository } from '@src/repository/horaire_shop';
import { SiretRepository } from '@repository/siret';

@Resolver(() => Shop)
@Service()
export class ShopResolvers implements ResolverInterface<Shop> {
  private readonly artisanRepository: ArtisanRepository;
  private readonly shopRepository: ShopRepository;
  private readonly productRepository: ProductRepository;
  private readonly category_productRepository: Category_productRepository;
  private readonly clientRepository: ClientRepository;
  private readonly category_shopRepository: Category_shopRepository;
  private readonly horaire_shopRepository: HoraireShopRepository;
  private readonly siretRepository: SiretRepository;

  public constructor(
    artisanRepository: ArtisanRepository,
    productRepository: ProductRepository,
    shopRepository: ShopRepository,
    clientRepository: ClientRepository,
    category_productRepository: Category_productRepository,
    category_shopRepository: Category_shopRepository,
    horaire_shopRepository: HoraireShopRepository,
    siretRepository: SiretRepository
  ) {
    this.artisanRepository = artisanRepository;
    this.productRepository = productRepository;
    this.shopRepository = shopRepository;
    this.clientRepository = clientRepository;
    this.category_productRepository = category_productRepository;
    this.category_shopRepository = category_shopRepository;
    this.horaire_shopRepository = horaire_shopRepository;
    this.siretRepository = siretRepository;
  }

  @Query(() => Shop, { nullable: true })
  @Authorized()
  public async shop(@Arg('shopId') shopId: number): Promise<Shop | null> {
    return await this.shopRepository.findOneBy({
      id: shopId
    });
  }

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
        const me = await this.artisanRepository.findOneBy({
          id: Number(ctx?.payload?.userId)
        });
        zipCodeSearch = me?.zipCode ? [me?.zipCode] : undefined;
      } else {
        const me = await this.clientRepository.findOneBy({
          id: Number(ctx?.payload?.userId)
        });
        zipCodeSearch = me?.zipCode ? [me?.zipCode] : undefined;
      }
    }
    if (!filtersInput?.categoriesIds?.length && zipCodeSearch?.length) {
      return this.shopRepository.findByZipCodes(zipCodeSearch);
    }
    if (zipCodeSearch?.length && filtersInput?.categoriesIds) {
      return this.shopRepository.findByCategoriesShopWithZipCodes(
        zipCodeSearch,
        filtersInput?.categoriesIds
      );
    }
    return null;
  }

  @FieldResolver()
  @Authorized()
  public async artisan(@Root() shop: Shop): Promise<Artisan> {
    const artisan = await this.artisanRepository.findArtisanOfShop(shop.id);
    if (!artisan) {
      throw new Error('Artisan not found');
    }
    return artisan;
  }

  @FieldResolver({ description: 'All categories of a shop' })
  @Authorized()
  public async categoriesShops(@Root() shop: Shop): Promise<Category_shop[]> {
    const catShop = await this.category_shopRepository.findCategoryOfShop(
      shop.id
    );
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
    return await this.category_productRepository.findCategoriesProductByShop(
      shop.id
    );
  }

  @FieldResolver()
  @Authorized()
  public async horaireShop(
    @Root() shop: Shop
  ): Promise<Horaire_shop[] | undefined> {
    return await this.horaire_shopRepository.findHoraireOfShop(shop.id);
  }

  @Mutation(() => Shop, { nullable: true })
  @Authorized(Role.ARTISAN)
  public async createShop(
    @Ctx() ctx: MyContext,
    @Arg('CreateShopInput')
    createShopInput: CreateShopInput,
    @Arg('InputHoraireShop', () => [InputHoraireShop], {
      nullable: true
    })
    inputHoraireShop?: InputHoraireShop[]
  ): Promise<Shop | null> {
    const artisan = await this.artisanRepository.findOne({
      relations: {
        siren: true
      },
      where: { id: Number(ctx?.payload?.userId) }
    });

    if (artisan?.role !== Role.ARTISAN) {
      throw new Error('Not authorized');
    }

    if (!createShopInput?.siretNumber) {
      throw new Error('Siret requier');
    }

    if (!createShopInput?.shopCategoriesIds.length) {
      throw new Error('Category required');
    }

    const categories = await this.category_shopRepository.findByCategoriesIds(
      createShopInput?.shopCategoriesIds
    );

    if (!categories.length) {
      throw new Error('Category not found');
    }

    const siret = this.siretRepository.create({
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
    //         res.data.etablissement.addresseEtablissement.codePostalEtablissement
    //       ) !== createShopInput.zipCode
    //     ) {
    //       throw new Error('not good zip code');
    //     }
    //   })
    //   .catch((e) => {
    //     throw new Error(`${e}`);
    //   });

    const shop = this.shopRepository.create({
      name: createShopInput.name,
      description: createShopInput.city,
      address: createShopInput.address,
      zipCode: createShopInput.zipCode,
      city: createShopInput.city,
      artisan: artisan,
      siret: await this.siretRepository.save(siret),
      categoriesShops: categories
    });
    const shopSaved = await this.shopRepository.save(shop);

    if (inputHoraireShop) {
      await Promise.all(
        inputHoraireShop.map((h) => {
          return this.horaire_shopRepository.save(
            this.horaire_shopRepository.create({
              dayId: h.dayId,
              timeAmStart: h.timeAmStart,
              timeAmEnd: h.timeAmEnd,
              timePmStart: h.timePmStart,
              timePmEnd: h.timePmEnd,
              shop: shopSaved
            })
          );
        })
      );
    }

    return shop;
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ADMIN)
  public async moderateShop(
    @Ctx() ctx: MyContext,
    @Arg('id') id: number,
    @Arg('statusModeration') statusModeration: StatusModeration
  ): Promise<boolean> {
    const shop = await this.shopRepository.findOne({
      where: { id }
    });
    if (!shop) {
      throw new Error('Product not found');
    }
    shop.enabled = statusModeration;
    return await shop
      .save()
      .then(() => true)
      .catch(() => {
        throw new Error('Product not moderated');
      });
  }
}
