import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { CategoryShopInput, Category_shop } from '@entity/category_shop';
import { Role } from '@entity/generic/user';
import { AppDataSource } from '@src/app-data-source';

const CategoryShopRepository = AppDataSource.getRepository(Category_shop);

@Resolver(() => Category_shop)
@Service()
export class CategoryShopResolver {
  @Query(() => [Category_shop])
  @Authorized()
  public async categories_shop(): Promise<Category_shop[]> {
    return await CategoryShopRepository.find();
  }

  @Mutation(() => Category_shop)
  @Authorized(Role.ARTISAN)
  public async createCategoryShop(
    @Arg('CategoryShopInput') { name, picture }: CategoryShopInput
  ): Promise<Category_shop | null> {
    const categoryShop = CategoryShopRepository.create({
      name: name,
      picture: picture
    });
    await CategoryShopRepository.save(categoryShop);
    return categoryShop;
  }
}
