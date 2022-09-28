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
  @Authorized('ARTISAN')
  public async createShop(
    @Ctx() ctx: MyContext,
    @Arg('createShopInput') createShopInput?: CreateShopInput
  ): Promise<Shop | null> {
    const user = await User.findOne({
      where: { id: Number(ctx.payload.userId) },
    });
    const shop = ShopRepository.create({
      name: createShopInput.name,
      description: createShopInput.city,
      adress: createShopInput.adress,
      zipCode: createShopInput.zipCode,
      city: createShopInput.city,
      user: user,
    });
    await ShopRepository.save(shop);
    return shop;
  }
}
