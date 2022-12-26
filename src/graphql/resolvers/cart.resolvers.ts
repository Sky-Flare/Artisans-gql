import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { ActionCart, UpdateCart } from '../../entities/cart';

import { Cart } from '@entity/cart';
import { Client } from '@entity/client';
import { Role } from '@entity/generic/user';
import { Product } from '@entity/product';
import { MyContext } from '~/graphql/myContext';

@Resolver(() => Cart)
@Service()
export class CartResolvers {
  @Query(() => [Cart], { nullable: true })
  @Authorized(Role.CLIENT)
  async clientCart(@Ctx() ctx: MyContext): Promise<Cart[] | null> {
    if (!ctx.payload?.userId) {
      return null;
    }
    return await Cart.find({
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

    const cart = await Cart.findOne({
      where: { clientId: client?.id, productId: productId },
      relations: { product: true }
    });

    if (cart) {
      if (action === ActionCart.Remove && cart.quantity === 1) {
        cart.remove();
        return null;
      } else {
        cart.quantity =
          action === ActionCart.Remove ? cart.quantity - 1 : cart.quantity + 1;
        return await cart.save();
      }
    } else {
      const cart = Cart.create({
        clientId: client?.id,
        productId: productId,
        quantity: 1
      });
      return await cart.save();
    }
  }
}
