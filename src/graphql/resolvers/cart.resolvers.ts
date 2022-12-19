import { Product } from '@entity/product';
import { ProductRepository } from '@repository/product';
import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { Cart } from '@entity/cart';
import { Role } from '~/entities/generic/user';

@Resolver(() => Cart)
@Service()
export class CartResolver {
  @Mutation(() => Cart)
  @Authorized(Role.CLIENT)
  public async addProductToCart(
    @Arg('productId') productId: number
  ): Promise<Product | null> {
    return await ProductRepository.findOneBy({
      id: productId
    });
  }
}
