import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root
} from 'type-graphql';
import { Service } from 'typedi';

import { Artisan } from '@entity/artisan';
import { Category_product } from '@entity/category_product';
import { Role } from '@entity/generic/user';
import { CreateProductInput, Product } from '@entity/product';
import { Shop } from '@entity/shop';
import { Category_productRepository } from '@repository/category_product';
import { ProductRepository } from '@repository/product';
import { ShopRepository } from '@repository/shop';
import { MyContext } from '~/graphql/myContext';

@Resolver(() => Product)
@Service()
export class ProductResolvers {
  @FieldResolver()
  @Authorized()
  public async categoriesProducts(
    @Root() product: Product
  ): Promise<Category_product[]> {
    return await Category_productRepository.findCategoriesProductOfOneProduct(
      product.id
    );
  }

  @FieldResolver()
  @Authorized()
  public async shops(@Root() product: Product): Promise<Shop[]> {
    return await ShopRepository.findByProductId(product.id);
  }

  @Mutation(() => Product, { nullable: true })
  @Authorized(Role.ARTISAN)
  public async createProduct(
    @Ctx() ctx: MyContext,
    @Arg('createProductInput')
    createProductInput: CreateProductInput
  ): Promise<Product | null> {
    const me = await Artisan.findOneBy({ id: Number(ctx?.payload?.userId) });

    if (!me) {
      throw new Error('Artisan not found');
    }
    let shopsSlected: Shop[] = [];
    if (createProductInput.shopsIds?.length) {
      shopsSlected = await ShopRepository.findByShopsIds(
        createProductInput.shopsIds
      );
    }
    let categoriesProductSlected: Category_product[] = [];
    if (createProductInput.categoriesProductsIds?.length) {
      categoriesProductSlected =
        await Category_productRepository.findCategoriesProductByIds(
          createProductInput.categoriesProductsIds
        );
    }
    const product = ProductRepository.create({
      name: createProductInput.name,
      description: createProductInput.description,
      price: createProductInput.price,
      picture: createProductInput.picture,
      shops: shopsSlected,
      artisan: me,
      categoriesProducts: categoriesProductSlected
    });
    return await product.save();
  }
}
