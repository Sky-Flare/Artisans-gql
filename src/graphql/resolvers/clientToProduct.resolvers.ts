import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { Client } from '@entity/client';
import {
  ActionClientToProduct,
  ClientToProduct,
  UpdateClientToProduct
} from '@entity/clientToProduct';
import { Role } from '@entity/generic/user';
import { Product } from '@entity/product';
import { MyContext } from '~/graphql/myContext';

@Resolver(() => ClientToProduct)
@Service()
export class ClientToProductResolvers {
  @Query(() => [ClientToProduct], { nullable: true })
  @Authorized(Role.CLIENT)
  async clientCart(@Ctx() ctx: MyContext): Promise<ClientToProduct[] | null> {
    if (!ctx.payload?.userId) {
      return null;
    }
    return await ClientToProduct.find({
      where: { clientId: Number(ctx.payload.userId) },
      relations: {
        product: true
      }
    });
  }

  @Mutation(() => ClientToProduct, { nullable: true })
  @Authorized(Role.CLIENT)
  public async updateProductToCart(
    @Ctx() ctx: MyContext,
    @Arg('UpdateClientToProduct') { productId, action }: UpdateClientToProduct
  ): Promise<ClientToProduct | null> {
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

    const cartProduct = await ClientToProduct.findOne({
      where: { clientId: client?.id, productId: productId }
    });

    if (cartProduct) {
      if (
        action === ActionClientToProduct.Remove &&
        cartProduct.quantity === 1
      ) {
        cartProduct.remove();
        return null;
      } else {
        cartProduct.quantity =
          action === ActionClientToProduct.Remove
            ? cartProduct.quantity - 1
            : cartProduct.quantity + 1;
        return await cartProduct.save();
      }
    } else {
      const cartToProduct = ClientToProduct.create({
        clientId: client?.id,
        productId: productId,
        quantity: 1
      });
      return await cartToProduct.save();
    }
  }
}
