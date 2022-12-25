import { Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { Cart } from '@entity/cart';

@Resolver(() => Cart)
@Service()
export class CartResolver {
  //   @FieldResolver({ description: 'All products of a shop' })
  //   @Authorized()
  //   public async products(@Root() cart: Cart): Promise<Product[] | undefined> {
  //     console.log('CartResolver cart', cart);
  //     return await ProductRepository.findProductsOfShop(cart.id);
  //   }
}
