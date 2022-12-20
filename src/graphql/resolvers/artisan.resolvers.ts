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
import { Role } from '~/entities/generic/user';

import { Product } from '@entity/product';
import { Shop } from '@entity/shop';
import { ProductRepository } from '@repository/product';
import { AppDataSource } from '~/app-data-source';
import { Artisan, CreateArtisanInput } from '~/entities/artisan';
import { MyContext } from '~/graphql/myContext';

const ArtisanRepository = AppDataSource.getRepository(Artisan);
const ShopRepository = AppDataSource.getRepository(Shop);

@Resolver(() => Artisan)
@Service()
export class ArtisanResolvers {
  @FieldResolver()
  @Authorized()
  public async shops(@Root() artisan: Artisan): Promise<Shop[]> {
    return await ShopRepository.find({
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
    return await ProductRepository.findProductsOfArtisan(artisan.id);
  }

  @Query(() => [Artisan], {
    nullable: true,
    description: 'Return all artisans'
  })
  @Authorized()
  public async artisans(): Promise<Artisan[]> {
    return await ArtisanRepository.find({});
  }

  @Query(() => Artisan, { nullable: true, description: 'Return on artisan' })
  @Authorized()
  public async artisan(
    @Arg('artisanId', { nullable: true }) artisanId?: number
  ): Promise<Artisan | null> {
    return await ArtisanRepository.findOneBy({
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
  //todo : just if its me
  async updateArtisan(
    @Arg('id') id: number,
    @Arg('data') data: CreateArtisanInput
  ) {
    const artisan = await Artisan.findOne({ where: { id } });
    if (!artisan) {
      throw new Error('Artisan not found !');
    }
    Object.assign(artisan, data);
    await artisan.save();
    return artisan;
  }

  @Mutation(() => Boolean)
  async deleteArtisan(@Arg('id') id: number) {
    const artisan = await Artisan.findOne({ where: { id } });
    if (!artisan) throw new Error('Artisan not found !');
    return await artisan
      .remove()
      .then(() => true)
      .catch(() => false);
  }
}
