import { AppDataSource } from '../app-data-source';
import { Category_product } from '../entities/category_product';
import { Category_shop } from '../entities/category_shop';
import { Shop } from '../entities/shop';

export const Category_productRepository = AppDataSource.getRepository(
  Category_product
).extend({
  findCategoriesProductByShop(shopId: number): Category_product[] {
    return this.createQueryBuilder('category_product')
      .leftJoin('category_product.shops', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getMany();
  },
  findCategoriesProductByIds(categoriesProductIds: number[]) {
    return this.createQueryBuilder('category_product')
      .where('category_product.id IN (:...ids)', {
        ids: categoriesProductIds,
      })
      .getMany();
  },
  findCategoriesProductOfOneProduct(productId: number) {
    return this.createQueryBuilder('category_product')
      .leftJoin('category_product.products', 'product')
      .where('product.id = :id', { id: productId })
      .getMany();
  },
});
