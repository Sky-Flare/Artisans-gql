import { AppDataSource } from '../app-data-source';
import { Category_product } from '../entities/category_product';

export const Category_productRepository = AppDataSource.getRepository(
  Category_product
).extend({
  findCategoriesProductByShop(shopId: number): Promise<Category_product[]> {
    return this.createQueryBuilder('category_product')
      .leftJoin('category_product.shops', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getMany();
  },
  findCategoriesProductByIds(
    categoriesProductIds: number[]
  ): Promise<Category_product[]> {
    return this.createQueryBuilder('category_product')
      .where('category_product.id IN (:...ids)', {
        ids: categoriesProductIds
      })
      .getMany();
  },
  findCategoriesProductOfOneProduct(
    productId: number
  ): Promise<Category_product[]> {
    return this.createQueryBuilder('category_product')
      .leftJoin('category_product.products', 'product')
      .where('product.id = :id', { id: productId })
      .getMany();
  }
});
