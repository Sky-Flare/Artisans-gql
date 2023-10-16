import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { CategoryShopInput, Category_shop } from '@entity/category_shop';
import { Role } from '@entity/generic/user';
import { Category_shopRepository } from '@repository/category_shop';

@Resolver(() => Category_shop)
@Service()
export class CategoryShopResolver {
  private readonly category_shopRepository: Category_shopRepository;

  public constructor(category_shopRepository: Category_shopRepository) {
    this.category_shopRepository = category_shopRepository;
  }
  @Query(() => [Category_shop])
  @Authorized()
  public async categories_shop(): Promise<Category_shop[]> {
    return await this.category_shopRepository.find();
  }

  @Mutation(() => Category_shop)
  @Authorized(Role.ARTISAN)
  public async createCategoryShop(
    @Arg('CategoryShopInput') { name, picture }: CategoryShopInput
  ): Promise<Category_shop | null> {
    const categoryShop = this.category_shopRepository.create({
      name: name,
      picture: picture
    });
    await this.category_shopRepository.save(categoryShop);
    return categoryShop;
  }
}
