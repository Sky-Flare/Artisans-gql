import { Product } from '@entity/product';
import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';

@Service()
export class ProductRepository extends Repository<Product> {
  private readonly productRepository: Repository<Product>;

  public constructor(dataSource: DataSource) {
    super(Product, dataSource.manager);

    this.productRepository = dataSource.getRepository(Product);
  }

  public findProductsOfShop(shopId: number): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoin('product.shops', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getMany();
  }
  public findProductsOfArtisan(artisanId: number): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoin('product.artisan', 'artisan')
      .where('artisan.id = :id', { id: artisanId })
      .getMany();
  }
  public findProductsByCategoryProduct(catProduct: number): Promise<Product[]> {
    return this.createQueryBuilder('product')
      .leftJoin('product.categoriesProducts', 'category_product')
      .where('category_product.id = :id', { id: catProduct })
      .getMany();
  }
  public findProductByIdAndByArtisanId(
    productId: number,
    artId: number
  ): Promise<Product | null> {
    return this.createQueryBuilder('product')
      .leftJoin('product.artisan', 'artisan')
      .where('product.id = :id', { id: productId })
      .andWhere('artisan.id = :artisanId', { artisanId: artId })
      .getOne();
  }
}
