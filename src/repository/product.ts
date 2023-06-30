import { Product } from '@entity/product';
import { AppDataSource } from '~/app-data-source';

export const ProductRepository = AppDataSource.getRepository(Product).extend({
  findProductsOfShop(shopId: number): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoin('product.shops', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getMany();
  },
  findProductsOfArtisan(artisanId: number): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoin('product.artisan', 'artisan')
      .where('artisan.id = :id', { id: artisanId })
      .getMany();
  },
  findProductsByCatgoryProduct(catProduct: number): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoin('product.categoriesProducts', 'category_product')
      .where('category_product.id = :id', { id: catProduct })
      .getMany();
  },
  findProductByIdAndByArtisanId(
    productId: number,
    artId: number
  ): Promise<Product | null> {
    return this.createQueryBuilder('product')
      .leftJoin('product.artisan', 'artisan')
      .where('product.id = :id', { id: productId })
      .andWhere('artisan.id = :artisanId', { artisanId: artId })
      .getOne();
  }
});
