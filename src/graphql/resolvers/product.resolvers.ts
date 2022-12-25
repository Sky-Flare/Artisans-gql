import { Cart } from '@entity/cart';
import { Client } from '@entity/client';
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
import { CartToProduct } from '~/entities/cartToProduct';

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

  @Mutation(() => Cart)
  @Authorized(Role.CLIENT)
  public async addProductToCart(
    @Ctx() ctx: MyContext,
    @Arg('productId') productId: number
  ): Promise<CartToProduct | undefined> {
    const client = await Client.findOne({
      where: { id: Number(ctx?.payload?.userId) }
    });
    if (!client) {
      throw new Error('Client not found');
    }
    const product = await Product.findOne({
      where: { id: productId }
    });
    if (!product) {
      throw new Error('Product not found');
    }

    const cartProduct = await CartToProduct.findOne({
      where: { cartId: client?.cartId, productId: productId }
    });

    if (cartProduct) {
      cartProduct.quantity = cartProduct.quantity + 1;
      return await cartProduct.save();
    } else {
      const cartToProduct = CartToProduct.create({
        cartId: client?.cartId,
        productId: productId,
        quantity: 1
      });
      return await cartToProduct.save();
    }
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
    console.log('⚠️', product);

    return await product.save();
  }
}
