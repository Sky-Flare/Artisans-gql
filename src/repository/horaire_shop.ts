import { Horaire_shop } from '@entity/horaire_shop';
import { DataSource, Repository } from 'typeorm';
import { Service } from 'typedi';
@Service()
export class HoraireShopRepository extends Repository<Horaire_shop> {
  private readonly horaireShopRepository: Repository<Horaire_shop>;

  constructor(dataSource: DataSource) {
    super(Horaire_shop, dataSource.manager);
    this.horaireShopRepository = dataSource.getRepository(Horaire_shop);
  }

  public findHoraireOfShop(shopId: number): Promise<Horaire_shop[]> {
    return this.createQueryBuilder('horaire_shop')
      .leftJoin('horaire_shop.shop', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getMany();
  }
}
