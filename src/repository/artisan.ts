import { Artisan } from '@entity/artisan';
import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';

@Service()
export class ArtisanRepository extends Repository<Artisan> {
  private readonly artisanRepository: Repository<Artisan>;

  public constructor(dataSource: DataSource) {
    super(Artisan, dataSource.manager);

    this.artisanRepository = dataSource.getRepository(Artisan);
  }

  public async findArtisanOfShop(shopId: number): Promise<Artisan | null> {
    return this.createQueryBuilder('artisan')
      .leftJoin('artisan.shops', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getOne();
  }
}
