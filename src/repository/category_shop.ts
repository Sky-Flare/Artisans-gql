import { AppDataSource } from '@src/app-data-source';
import { Category_shop } from '@entity/category_shop';

export const Category_shopRepository = AppDataSource.getRepository(
  Category_shop
).extend({
  findCategoryOfShop(shopId: number): Promise<Category_shop[]> {
    return this.createQueryBuilder('category_shop')
      .leftJoin('category_shop.shops', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getMany();
  },
  findByCategoriesIds(ids: number[]): Promise<Category_shop[]> {
    return this.createQueryBuilder('category_shop')
      .where('category_shop.id IN (:...ids)', {
        ids: ids
      })
      .getMany();
  }
});
