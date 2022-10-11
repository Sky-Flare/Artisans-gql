import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from 'type-graphql';
import { Service } from 'typedi';
import { AppDataSource } from '../../app-data-source';

import { Role } from '../../entities/user';
import { Category_shop } from '../../entities/category_shop';
import { Shop } from '../../entities/shop';
import { ShopRepository } from 'src/repository/shop';
import { MyContext } from '../myContext';
import { UserRepository } from 'src/repository/user';

const CategoryShopRepository = AppDataSource.getRepository(Category_shop);

@Resolver((of) => Category_shop)
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
    @Arg('name') name: string,
    @Arg('picture', { nullable: true }) picture?: string
  ): Promise<Category_shop | null> {
    const categoryShop = CategoryShopRepository.create({
      name: name,
      picture: picture,
    });
    await CategoryShopRepository.save(categoryShop);
    return categoryShop;
  }
}
