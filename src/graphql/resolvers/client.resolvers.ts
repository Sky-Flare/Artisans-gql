import {
  Authorized,
  Ctx,
  FieldResolver,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { Service } from 'typedi';
import { Cart } from '~/entities/cart';

import { Client } from '@entity/client';
import { Role } from '@entity/generic/user';
import { MyContext } from '~/graphql/myContext';

@Resolver(() => Client)
@Service()
export class ClientResolvers {
  @Query(() => Client, { nullable: true })
  @Authorized(Role.CLIENT)
  async meClient(@Ctx() ctx: MyContext): Promise<Client | null> {
    if (!ctx.payload?.userId) {
      return null;
    }
    return Client.findOne({ where: { id: Number(ctx.payload.userId) } });
  }

  @FieldResolver()
  @Authorized(Role.CLIENT)
  public async cart(@Root() client: Client): Promise<Cart[]> {
    return await Cart.find({
      where: { clientId: Number(client?.id) },
      relations: {
        product: true
      }
    });
  }
}
