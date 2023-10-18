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
import { Category_product } from '@entity/category_product';
import { Role } from '@entity/generic/user';
import { CreateProductInput, Product, ProductsFilters } from '@entity/product';
import { Shop } from '@entity/shop';
import { Category_productRepository } from '@repository/category_product';
import { ProductRepository } from '@repository/product';
import { ShopRepository } from '@repository/shop';
import { MyContext } from '@src/graphql/myContext';
import { ArtisanRepository } from '@repository/artisan';

@Resolver(() => Product)
@Service()
export class ProductResolvers {
  private readonly artisanRepository: ArtisanRepository;
  private readonly shopRepository: ShopRepository;
  private readonly productRepository: ProductRepository;
  private readonly category_productRepository: Category_productRepository;

  public constructor(
    artisanRepository: ArtisanRepository,
    productRepository: ProductRepository,
    shopRepository: ShopRepository,
    category_productRepository: Category_productRepository
  ) {
    this.artisanRepository = artisanRepository;
    this.productRepository = productRepository;
    this.shopRepository = shopRepository;
    this.category_productRepository = category_productRepository;
  }

  @Query(() => [Product], { nullable: true })
  @Authorized()
  public async products(
    @Ctx() ctx: MyContext,
    @Arg('filtersProducts')
    productsFilters?: ProductsFilters
  ): Promise<Product[] | null> {
    if (!productsFilters?.shopId) {
      return null;
    }
    let catsProducts: number[] = productsFilters.categoriesProductsIds ?? [];

    if (!productsFilters?.categoriesProductsIds?.length) {
      await this.category_productRepository
        .findCategoriesProductByShop(productsFilters.shopId)
        .then((cats) => {
          catsProducts = cats.length ? cats.map((cat) => cat.id) : [];
        });
    }
    if (!catsProducts.length) {
      return [];
    }
    return this.productRepository.findProductsOfShopAndCatsProduct(
      productsFilters?.shopId,
      catsProducts
    );
  }

  @FieldResolver()
  @Authorized()
  public async categoriesProducts(
    @Root() product: Product
  ): Promise<Category_product[]> {
    return await this.category_productRepository.findCategoriesProductOfOneProduct(
      product.id
    );
  }

  @FieldResolver()
  @Authorized()
  public async shops(@Root() product: Product): Promise<Shop[]> {
    return await this.shopRepository.findByProductId(product.id);
  }

  @Mutation(() => Boolean)
  @Authorized(Role.ARTISAN)
  public async deleteProduct(
    @Ctx() ctx: MyContext,
    @Arg('id') id: number
  ): Promise<boolean> {
    const me = await this.artisanRepository.findOneBy({
      id: Number(ctx?.payload?.userId)
    });
    if (!me) {
      throw new Error('Artisan not found');
    }

    const product = await this.productRepository.findProductByIdAndByArtisanId(
      id,
      Number(ctx?.payload?.userId)
    );
    if (!product) {
      throw new Error('Product not found');
    }

    return await product
      .remove()
      .then(() => {
        return true;
      })
      .catch(() => {
        throw new Error('Product not deleted');
      });
  }

  @Mutation(() => Product, { nullable: true })
  @Authorized(Role.ARTISAN)
  public async createProduct(
    @Ctx() ctx: MyContext,
    @Arg('createProductInput')
    createProductInput: CreateProductInput
  ): Promise<Product | null> {
    const me = await this.artisanRepository.findOneBy({
      id: Number(ctx?.payload?.userId)
    });

    if (!me) {
      throw new Error('Artisan not found');
    }
    let shopsSlected: Shop[] = [];
    if (createProductInput.shopsIds?.length) {
      shopsSlected = await this.shopRepository
        .findByShopsIds(createProductInput.shopsIds, me.id)
        .then((shops) => {
          if (shops.length === createProductInput.shopsIds?.length) {
            return shops;
          } else {
            throw new Error('Shop not found');
          }
        });
    }

    let categoriesProductSlected: Category_product[] = [];
    if (createProductInput.categoriesProductsIds?.length) {
      categoriesProductSlected = await this.category_productRepository
        .findCategoriesProductByIds(createProductInput.categoriesProductsIds)
        .then((categoriesProduct) => {
          if (
            categoriesProduct.length ===
            createProductInput.categoriesProductsIds?.length
          ) {
            return categoriesProduct;
          } else {
            throw new Error('Categories product not found');
          }
        });
    }

    // I verify that the categories product are in the shop
    for (const shop of shopsSlected) {
      for (const cat of categoriesProductSlected) {
        if (
          !shop.categoriesProducts?.some((catShop) => catShop.id === cat.id)
        ) {
          shop.categoriesProducts?.push(cat);
          await shop.save();
        }
      }
    }

    const product = this.productRepository.create({
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
