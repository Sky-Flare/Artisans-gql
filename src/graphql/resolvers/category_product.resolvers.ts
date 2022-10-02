import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { AppDataSource } from '../../app-data-source';

import { Role } from '../../entities/user';
import { Category_shop } from '../../entities/category_shop';
import { Category_product } from '../../entities/category_product';
import { Category_productRepository } from '../../repository/category_product';

const CategoryShopRepository = AppDataSource.getRepository(Category_shop);

Resolver((of) => Category_product);
@Service()
export class CategoryProductResolver {
  @Query(() => [Category_product])
  @Authorized()
  public async categories_productByShop(
    @Arg('shopId') shopId: number
  ): Promise<Category_product[]> {
    return await Category_productRepository.findCategoriesByShop(shopId);
  }

  @Mutation(() => Category_product)
  @Authorized(Role.ARTISAN)
  public async createCategoryProduct(
    @Arg('name') name: string,
    @Arg('picture', { nullable: true }) picture?: string
  ): Promise<Category_product | null> {
    const categoryProduct = Category_productRepository.create({
      name: name,
      picture: picture ?? null,
    });
    return await Category_productRepository.save(categoryProduct);
  }
}
