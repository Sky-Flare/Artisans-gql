import { Category_shop } from '@entity/category_shop';
import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';

@Service()
export class Category_shopRepository extends Repository<Category_shop> {
  private readonly category_shopRepository: Repository<Category_shop>;

  public constructor(dataSource: DataSource) {
    super(Category_shop, dataSource.manager);

    this.category_shopRepository = dataSource.getRepository(Category_shop);
  }
  public findCategoryOfShop(shopId: number): Promise<Category_shop[]> {
    return this.createQueryBuilder('category_shop')
      .leftJoin('category_shop.shops', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getMany();
  }
  public findByCategoriesIds(ids: number[]): Promise<Category_shop[]> {
    return this.createQueryBuilder('category_shop')
      .where('category_shop.id IN (:...ids)', {
        ids: ids
      })
      .getMany();
  }
}
