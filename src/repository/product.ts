import { AppDataSource } from '../app-data-source';
import { Product } from '../entities/product';

export const ProductRepository = AppDataSource.getRepository(Product).extend({
  findProductsOfShop(shopId: number): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoin('product.shops', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getMany();
  },
  findProductsOfUser(userId: number): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoin('product.user', 'user')
      .where('user.id = :id', { id: userId })
      .getMany();
  },
  findProductsByCatgoryProduct(catProduct: number): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoin('product.categoriesProducts', 'category_product')
      .where('category_product.id = :id', { id: catProduct })
      .getMany();
  }
});
