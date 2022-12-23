import { Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { Cart } from '@entity/cart';

@Resolver(() => Cart)
@Service()
export class CartResolver {}
