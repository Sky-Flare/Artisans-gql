import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';

import { Service } from 'typedi';
import { AppDataSource } from '../../app-data-source';
import { Shop, CreateShopInput } from '../../entities/shop';
import { User } from '../../entities/user';
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

  @Mutation(() => Shop, { nullable: true })
  @Authorized('ARTISAN')
  public async createShop(
    @Ctx() ctx: MyContext,
    @Arg('createShopInput') createShopInput?: CreateShopInput
  ): Promise<Shop | null> {
    console.log('😃😃😃😃😃', ctx.payload.userId);
    const user = await User.findOne({
      where: { id: Number(ctx.payload.userId) },
    });
    const shop = ShopRepository.create({
      name: createShopInput.name,
      description: createShopInput.city,
      adress: createShopInput.adress,
      zipCode: createShopInput.zipCode,
      city: createShopInput.city,
      user: Number(ctx.payload.userId),
    });
    await ShopRepository.save(shop);
    return shop;
  }
}
