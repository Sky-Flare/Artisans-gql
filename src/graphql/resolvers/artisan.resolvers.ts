import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { Service } from 'typedi';

import { Artisan, CreateArtisanInput } from '@entity/artisan';
import { Siren } from '@entity/siren';
import { Role } from '@entity/generic/user';
import { Product } from '@entity/product';
import { Shop } from '@entity/shop';
import { ProductRepository } from '@repository/product';
import { dataSource } from '@src/app-data-source';
import { MyContext } from '@src/graphql/myContext';
import { SirenRepository } from '@repository/siren';
import { ArtisanRepository } from '@repository/artisan';
import { ShopRepository } from '@repository/shop';

@Resolver(() => Artisan)
@Service()
export class ArtisanResolvers {
  private readonly artisanRepository: ArtisanRepository;
  private readonly sirenRepository: SirenRepository;
  private readonly shopRepository: ShopRepository;
  private readonly productRepository: ProductRepository;

  public constructor(
    artisanService: ArtisanRepository,
    sirenService: SirenRepository,
    productService: ProductRepository,
    shopRepository: ShopRepository
  ) {
    this.artisanRepository = artisanService;
    this.sirenRepository = sirenService;
    this.productRepository = productService;
    this.shopRepository = shopRepository;
  }
  @FieldResolver()
  @Authorized()
  public async shops(@Root() artisan: Artisan): Promise<Shop[]> {
    return await this.shopRepository.find({
      relations: {
        artisan: true
      },
      where: {
        artisan: {
          id: artisan.id
        }
      }
    });
  }

  @FieldResolver()
  @Authorized()
  public async products(@Root() artisan: Artisan): Promise<Product[]> {
    return await this.productRepository.findProductsOfArtisan(artisan.id);
  }

  @Query(() => [Artisan], {
    nullable: true,
    description: 'Return all artisans'
  })
  @Authorized()
  public async artisans(): Promise<Artisan[]> {
    return await this.artisanRepository.find({});
  }

  @Query(() => Artisan, { nullable: true, description: 'Return on artisan' })
  @Authorized()
  public async artisan(
    @Arg('artisanId', { nullable: true }) artisanId?: number
  ): Promise<Artisan | null> {
    return await this.artisanRepository.findOneBy({
      id: artisanId
    });
  }

  @Query(() => Artisan, { nullable: true })
  @Authorized(Role.ARTISAN)
  async meArtisan(@Ctx() ctx: MyContext): Promise<Artisan | null> {
    if (!ctx.payload?.userId) {
      return null;
    }
    return Artisan.findOne({ where: { id: Number(ctx.payload.userId) } });
  }

  @Mutation(() => Artisan)
  @Authorized(Role.ARTISAN)
  async updateArtisan(
    @Ctx() ctx: MyContext,
    @Arg('CreateArtisanInput') createArtisanInput: CreateArtisanInput
  ) {
    const artisan = await Artisan.findOne({
      where: { id: Number(ctx?.payload?.userId) },
      relations: { siren: true }
    });
    if (!artisan) {
      throw new Error('Artisan not found !');
    }

    if (
      createArtisanInput.sirenNumber &&
      createArtisanInput.sirenNumber !== artisan.siren?.siren
    ) {
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
    }
    Object.assign(artisan, createArtisanInput);
    await artisan.save();
    return artisan;
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ARTISAN)
  async deleteArtisan(@Ctx() ctx: MyContext) {
    const artisan = await Artisan.findOne({
      where: { id: Number(ctx.payload?.userId) }
    });
    if (!artisan) throw new Error('Artisan not found !');
    return await artisan
      .remove()
      .then(() => true)
      .catch(() => false);
  }
}
