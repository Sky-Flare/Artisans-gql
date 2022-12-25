import { Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

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
}
