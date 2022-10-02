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
import { MyContext } from '../myContext';
import { Shop, CreateShopInput } from '../../entities/shop';
import { Role, User } from '../../entities/user';
import { Siret } from '../../entities/siret';
import {
  GetShopCatIdsAndZipCode,
  Category_shop,
} from '../../entities/category_shop';
import { ShopRepository } from '../../repository/shop';
import { Category_shopRepository } from '../../repository/category_shop';
import { UserRepository } from '../../repository/user';
import { CreateProductInput, Product } from '../../entities/product';
import { ProductRepository } from '../../repository/product';

const SiretRepository = AppDataSource.getRepository(Siret);

@Resolver((of) => Product)
@Service()
export class ProductResolvers {
  @Mutation(() => Product, { nullable: true })
  @Authorized(Role.ARTISAN)
  public async createProduct(
    @Ctx() ctx: MyContext,
    @Arg('createProductInput')
    { name, description, price, picture, shopsIds }: CreateProductInput
  ): Promise<Product | null> {
    const me = await User.findOneBy({ id: Number(ctx?.payload?.userId) });

    if (!me) {
      throw new Error('Artisan not found');
    }
    let shopsSlected = [];
    if (shopsIds?.length) {
      shopsSlected = await ShopRepository.findByShopsIds(shopsIds);
    }
    const product = ProductRepository.create({
      name,
      description,
      price,
      picture,
      shops: shopsSlected.length ? shopsSlected : null,
      user: me,
    });

    return await product.save();
  }
}
