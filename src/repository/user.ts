import { AppDataSource } from '../app-data-source';
import { User } from '../entities/user';

export const UserRepository = AppDataSource.getRepository(User).extend({
  findUserOfShop(shopId: number): User {
    return this.createQueryBuilder('user')
      .leftJoin('user.shops', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getOne();
  },
});
