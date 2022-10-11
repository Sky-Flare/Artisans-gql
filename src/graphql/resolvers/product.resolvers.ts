import {
  Resolver,
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
import { Role, User } from '../../entities/user';
import { Siret } from '../../entities/siret';
import { Category_product } from '../../entities/category_product';
import { CreateProductInput, Product } from '../../entities/product';
import { ShopRepository } from '../../repository/shop';
import { Category_productRepository } from '../../repository/category_product';
import {} from '../../repository/category_shop';
import { ProductRepository } from '../../repository/product';
import { Shop } from 'src/entities/shop';

const SiretRepository = AppDataSource.getRepository(Siret);

@Resolver((of) => Product)
@Service()
export class ProductResolvers {
  @FieldResolver()
  @Authorized()
  public async categoriesProducts(
    @Root() product: Product
  ): Promise<Category_product[] | null> {
    return await Category_productRepository.findCategoriesProductOfOneProduct(
      product.id
    );
  }

  @Mutation(() => Product, { nullable: true })
  @Authorized(Role.ARTISAN)
  public async createProduct(
    @Ctx() ctx: MyContext,
    @Arg('createProductInput')
    {
      name,
      description,
      price,
      picture,
      shopsIds,
      categoriesProductsIds,
    }: CreateProductInput
  ): Promise<Product | null> {
    const me = await User.findOneBy({ id: Number(ctx?.payload?.userId) });

    if (!me) {
      throw new Error('Artisan not found');
    }
    let shopsSlected: Shop[] = [];
    if (shopsIds?.length) {
      shopsSlected = await ShopRepository.findByShopsIds(shopsIds);
    }
    let categoriesProductSlected: Category_product[] = [];
    if (categoriesProductsIds?.length) {
      categoriesProductSlected =
        await Category_productRepository.findCategoriesProductByIds(
          categoriesProductsIds
        );
    }
    const product = ProductRepository.create({
      name,
      description,
      price,
      picture,
      shops: shopsSlected,
      user: me,
      categoriesProducts: categoriesProductSlected,
    });

    return await product.save();
  }
}
