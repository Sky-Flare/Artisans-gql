import { Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Role } from '~/entities/generic/user';
import { Client } from './../../entities/client';

import { Artisan } from '~/entities/artisan';
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
    return Artisan.findOne({ where: { id: Number(ctx.payload.userId) } });
  }
}
