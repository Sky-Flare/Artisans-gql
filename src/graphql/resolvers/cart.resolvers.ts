import { Product } from '@entity/product';
import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { ProductRepository } from './../../repository/product';

import { Cart } from '@entity/cart';
import { Role } from '@entity/user';

@Resolver(() => Cart)
@Service()
export class CartResolver {
  @Mutation(() => Cart)
  @Authorized(Role.CLIENT)
  public async addProductToCart(
    @Arg('productId') productId: number
  ): Promise<Product | null> {
    console.log(productId);
    return await ProductRepository.findOneBy({
      id: productId
    });
  }
}
