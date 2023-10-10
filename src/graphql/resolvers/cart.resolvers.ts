import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { ActionCart, UpdateCart } from '@entity/cart';

import { Cart } from '@entity/cart';
import { Client } from '@entity/client';
import { Role } from '@entity/generic/user';
import { Product } from '@entity/product';
import { MyContext } from '@src/graphql/myContext';
import { ArtisanRepository } from '@repository/artisan';
import { SirenRepository } from '@repository/siren';
import { ShopRepository } from '@repository/shop';
import { ProductRepository } from '@repository/product';
import { CartRepository } from '@repository/cart';
import { ClientRepository } from '@repository/client';
import { SiretRepository } from '@repository/siret';

@Resolver(() => Cart)
@Service()
export class CartResolvers {
  private readonly cartRepository: CartRepository;
  private readonly productRepository: ProductRepository;
  private readonly clientRepository: ClientRepository;
  private readonly siretRepository: SiretRepository;

  public constructor(
    cartRepository: CartRepository,
    clientRepository: ClientRepository,
    productRepository: ProductRepository,
    siretRepository: SiretRepository
  ) {
    this.cartRepository = cartRepository;
    this.clientRepository = clientRepository;
    this.productRepository = productRepository;
    this.siretRepository = siretRepository;
  }
  @Query(() => [Cart], { nullable: true })
  @Authorized(Role.CLIENT)
  async clientCart(@Ctx() ctx: MyContext): Promise<Cart[] | null> {
    if (!ctx.payload?.userId) {
      return null;
    }
    return await this.cartRepository.find({
      where: { clientId: Number(ctx.payload.userId) },
      relations: {
        product: true
      }
    });
  }

  @Mutation(() => Cart, { nullable: true })
  @Authorized(Role.CLIENT)
  public async updateCart(
    @Ctx() ctx: MyContext,
    @Arg('UpdateCart') { productId, action }: UpdateCart
  ): Promise<Cart | null> {
    const client = await this.clientRepository.findOne({
      where: { id: Number(ctx?.payload?.userId) }
    });
    if (!client) {
      throw new Error('Client not found');
    }
    const product = await this.productRepository.findOne({
      where: { id: productId }
    });
    if (!product) {
      throw new Error('Product not found');
    }

    const cart = await this.cartRepository.findOne({
      where: { clientId: client?.id, productId: productId },
      relations: { product: true }
    });

    if (cart) {
      if (action === ActionCart.Remove && cart.quantity === 1) {
        await cart.remove();
        return null;
      } else {
        cart.quantity =
          action === ActionCart.Remove ? cart.quantity - 1 : cart.quantity + 1;
        return await cart.save();
      }
    } else {
      const cart = this.cartRepository.create({
        clientId: client?.id,
        productId: productId,
        quantity: 1
      });
      return await cart.save();
    }
  }
}
