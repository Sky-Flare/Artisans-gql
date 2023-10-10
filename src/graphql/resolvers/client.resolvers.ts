import {
  Authorized,
  Ctx,
  FieldResolver,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { Service } from 'typedi';
import { Cart } from '@entity/cart';

import { Client } from '@entity/client';
import { Role } from '@entity/generic/user';
import { MyContext } from '@src/graphql/myContext';
import { ClientRepository } from '@repository/client';

@Resolver(() => Client)
@Service()
export class ClientResolvers {
  private readonly clientRepository: ClientRepository;
  public constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }
  @Query(() => Client, { nullable: true })
  @Authorized(Role.CLIENT)
  async meClient(@Ctx() ctx: MyContext): Promise<Client | null> {
    if (!ctx.payload?.userId) {
      return null;
    }
    return this.clientRepository.findOne({
      where: { id: Number(ctx.payload.userId) }
    });
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
