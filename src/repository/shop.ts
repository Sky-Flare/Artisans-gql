import { AppDataSource } from '../app-data-source';
import { Shop } from '../entities/shop';

export const ShopRepository = AppDataSource.getRepository(Shop).extend({
  findByCategoriesShopWithZipCode(
    zipCode: number,
    categoriesIds: number[]
  ): Shop[] {
    return this.createQueryBuilder('shop')
      .leftJoin('shop.categoriesShops', 'category_shop')
      .where('category_shop.id IN (:...catIds)', {
        catIds: categoriesIds,
      })
      .andWhere('shop.zipCode = :zipCodeNumber', {
        zipCodeNumber: zipCode,
      })
      .getMany();
  },
  findByZipCode(zipCode: number): Shop[] {
    return this.createQueryBuilder('shop')
      .where('shop.zipCode = :zipCodeNumber', {
        zipCodeNumber: zipCode,
      })
      .getMany();
  },
  findByShopsIds(shopsIds: number[]): Shop[] {
    return this.createQueryBuilder('shop')
      .where('id IN (:...shopId)', {
        shopId: shopsIds,
      })
      .getMany();
  },
});
