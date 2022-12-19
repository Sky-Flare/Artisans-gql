import { Artisan } from '@entity/artisan';
import { AppDataSource } from '~/app-data-source';

export const ArtisanRepository = AppDataSource.getRepository(Artisan).extend({
  findArtisanOfShop(shopId: number): Promise<Artisan | null> {
    return this.createQueryBuilder('artisan')
      .leftJoin('artisan.shops', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getOne();
  }
});
