import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { Service } from 'typedi';

import {
  CategoryProductInput,
  Category_product,
  CategoryProductUpdate
} from '@entity/category_product';
import { Role } from '@entity/generic/user';
import { Shop } from '@entity/shop';
import { Category_productRepository } from '@repository/category_product';
import { ProductRepository } from '@repository/product';
import { ShopRepository } from '@repository/shop';
import { ArtisanRepository } from '@repository/artisan';
import { MyContext } from '@src/graphql/myContext';

@Resolver(() => Category_product)
@Service()
export class CategoryProductResolver {
  private readonly shopRepository: ShopRepository;
  private readonly productRepository: ProductRepository;
  private readonly category_productRepository: Category_productRepository;
  private readonly artisanRepository: ArtisanRepository;

  public constructor(
    productService: ProductRepository,
    shopRepository: ShopRepository,
    category_productRepository: Category_productRepository,
    artisanRepository: ArtisanRepository
  ) {
    this.productRepository = productService;
    this.shopRepository = shopRepository;
    this.category_productRepository = category_productRepository;
    this.artisanRepository = artisanRepository;
  }
  @Query(() => [Category_product])
  @Authorized()
  public async categories_productByShop(
    @Arg('shopId') shopId: number
  ): Promise<Category_product[]> {
    return await this.category_productRepository.findCategoriesProductByShop(
      shopId
    );
  }

  @FieldResolver()
  @Authorized()
  public async shops(@Root() catProduct: Category_product): Promise<Shop[]> {
    return await this.shopRepository.findShopByCategoryProduct(catProduct.id);
  }

  @Mutation(() => Category_product)
  @Authorized(Role.ARTISAN)
  public async createCategoryProduct(
    @Ctx() ctx: MyContext,
    @Arg('categoryProductInput')
    { shopsIds, name, picture }: CategoryProductInput
  ): Promise<Category_product | null> {
    const me = await this.artisanRepository.findOneBy({
      id: Number(ctx?.payload?.userId)
    });

    if (!me) {
      throw new Error('Artisan not found');
    }
    let shops: Shop[] = [];
    if (shopsIds?.length) {
      await this.shopRepository
        .findByShopsIds(shopsIds, me.id)
        .then((s) => {
          if (s.length !== shopsIds?.length) {
            throw new Error('All shops not found');
          }
          shops = s;
        })
        .catch((e) => {
          throw new Error(e);
        });
    }

    const categoryProduct = this.category_productRepository.create({
      name: name,
      picture: picture,
      shops: shops
    });

    return await this.category_productRepository.save(categoryProduct);
  }

  @Mutation(() => Category_product, { nullable: true })
  @Authorized(Role.ARTISAN)
  public async updateCategoryProduct(
    @Ctx() ctx: MyContext,
    @Arg('categoryProductUpdate')
    categoryProductUpdate: CategoryProductUpdate
  ): Promise<Category_product> {
    let shops: Shop[] = [];
    if (categoryProductUpdate.shopsIds?.length) {
      await this.shopRepository
        .findByShopsIds(
          categoryProductUpdate.shopsIds,
          Number(ctx?.payload?.userId)
        )
        .then((s) => {
          if (s.length !== categoryProductUpdate.shopsIds?.length) {
            throw new Error('All shops not found');
          }
          shops = s;
        })
        .catch((e) => {
          throw new Error(e);
        });
    }
    const categoryProduct = await this.category_productRepository.findOne({
      where: { id: categoryProductUpdate.categoryProductId },
      relations: { shops: true }
    });
    if (!categoryProduct) {
      throw new Error('Category product not found');
    }
    categoryProduct.shops = shops;
    return await this.category_productRepository.save(categoryProduct);
  }
}
