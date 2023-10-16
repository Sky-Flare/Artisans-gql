import { Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Horaire_shop } from '@entity/horaire_shop';

@Resolver(() => Horaire_shop)
@Service()
export class HorarairShopResolver {}
