import { Horaire_shop } from '@entity/horaire_shop';
import { AppDataSource } from '@src/app-data-source';

export const HoraireShopRepository = AppDataSource.getRepository(
  Horaire_shop
).extend({
  findHoraireOfShop(shopId: number): Promise<Horaire_shop[]> {
    return this.createQueryBuilder('horaire_shop')
      .leftJoin('horaire_shop.shop', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getMany();
  }
});
