import { AppDataSource } from '../app-data-source';
import { Shop } from '../entities/shop';

export const ShopRepository = AppDataSource.getRepository(Shop).extend({
  findByCategoriesShopWithZipCode(zipCode: number, categoriesIds: number[]) {
    return this.createQueryBuilder('shop')
      .leftJoin('shop.categories', 'category_shop')
      .where('category_shop.id IN (:...catIds)', {
        catIds: categoriesIds,
      })
      .andWhere('shop.zipCode = :zipCodeNumber', {
        zipCodeNumber: zipCode,
      })
      .getMany();
  },
  findByZipCode(zipCode: number) {
    return this.createQueryBuilder('shop')
      .where('shop.zipCode = :zipCodeNumber', {
        zipCodeNumber: zipCode,
      })
      .getMany();
  },
});
