import { Artisan } from '@entity/artisan';
import axios from 'axios';
import { AppDataSource } from '~/app-data-source';

export const ArtisanRepository = AppDataSource.getRepository(Artisan).extend({
  findArtisanOfShop(shopId: number): Promise<Artisan | null> {
    return this.createQueryBuilder('artisan')
      .leftJoin('artisan.shops', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getOne();
  }
});

export const checkSiren = async (sirenNumber: string) => {
  const siren = await axios.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenNumber}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.JWT_SIREN}`,
        Accept: 'application/json'
      }
    }
  );

  return siren;
};
