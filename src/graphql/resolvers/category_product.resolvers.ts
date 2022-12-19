import {
  Arg,
  Authorized,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { Service } from 'typedi';

import { Category_product } from '@entity/category_product';
import { Product } from '@entity/product';
import { Shop } from '@entity/shop';
import { Category_productRepository } from '@repository/category_product';
import { ProductRepository } from '@repository/product';
import { ShopRepository } from '@repository/shop';
import { Role } from '~/entities/generic/user';

@Resolver(() => Category_product)
@Service()
export class CategoryProductResolver {
  @Query(() => [Category_product])
  @Authorized()
  public async categories_productByShop(
    @Arg('shopId') shopId: number
  ): Promise<Category_product[]> {
    return await Category_productRepository.findCategoriesProductByShop(shopId);
  }

  @FieldResolver()
  @Authorized()
  public async products(
    @Root() catProduct: Category_product
  ): Promise<Product[]> {
    return await ProductRepository.findProductsByCatgoryProduct(catProduct.id);
  }

  @Mutation(() => Category_product)
  @Authorized(Role.ARTISAN)
  public async createCategoryProduct(
    @Arg('name') name: string,
    @Arg('picture', { nullable: true }) picture?: string,
    @Arg('shopsIds', () => [Number], { nullable: true }) shopsIds?: number[]
  ): Promise<Category_product | null> {
    let shops: Shop[] = [];
    if (shopsIds?.length) {
      shops = await ShopRepository.findByShopsIds(shopsIds);
    }

    const categoryProduct = Category_productRepository.create({
      name: name,
      picture: picture,
      shops: shops
    });

    return await Category_productRepository.save(categoryProduct);
  }
}
