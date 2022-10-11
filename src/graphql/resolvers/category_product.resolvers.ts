import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { AppDataSource } from '../../app-data-source';

import { Role } from '../../entities/user';
import { Category_product } from '../../entities/category_product';
import { Category_productRepository } from '../../repository/category_product';
import { ShopRepository } from '../../repository/shop';
import { Shop } from 'src/entities/shop';

Resolver((of) => Category_product);
@Service()
export class CategoryProductResolver {
  @Query(() => [Category_product])
  @Authorized()
  public async categories_productByShop(
    @Arg('shopId') shopId: number
  ): Promise<Category_product[]> {
    return await Category_productRepository.findCategoriesProductByShop(shopId);
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
      shops: shops,
    });

    return await Category_productRepository.save(categoryProduct);
  }
}
