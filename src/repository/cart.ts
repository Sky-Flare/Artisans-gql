import { Cart } from '@entity/cart';
import { AppDataSource } from '~/app-data-source';

export const CartRepository = AppDataSource.getRepository(Cart).extend({});
