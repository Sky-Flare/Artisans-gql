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

import {
  CategoryProductInput,
  Category_product
} from '@entity/category_product';
import { Role } from '@entity/generic/user';
import { Product } from '@entity/product';
import { Shop } from '@entity/shop';
import { Category_productRepository } from '@repository/category_product';
import { ProductRepository } from '@repository/product';
import { ShopRepository } from '@repository/shop';

@Resolver(() => Category_product)
@Service()
export class CategoryProductResolver {
  private readonly shopRepository: ShopRepository;
  private readonly productRepository: ProductRepository;
  private readonly category_productRepository: Category_productRepository;

  public constructor(
    productService: ProductRepository,
    shopRepository: ShopRepository,
    category_productRepository: Category_productRepository
  ) {
    this.productRepository = productService;
    this.shopRepository = shopRepository;
    this.category_productRepository = category_productRepository;
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
  public async products(
    @Root() catProduct: Category_product
  ): Promise<Product[]> {
    return await this.productRepository.findProductsByCategoryProduct(
      catProduct.id
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
    @Arg('categoryProductInput')
    { shopsIds, name, picture }: CategoryProductInput
  ): Promise<Category_product | null> {
    let shops: Shop[] = [];
    if (shopsIds?.length) {
      shops = await this.shopRepository.findByShopsIds(shopsIds);
    }

    const categoryProduct = this.category_productRepository.create({
      name: name,
      picture: picture,
      shops: shops
    });

    return await this.category_productRepository.save(categoryProduct);
  }
}
