import { Category_product } from '@entity/category_product';
import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';

@Service()
export class Category_productRepository extends Repository<Category_product> {
  private readonly category_productRepository: Repository<Category_product>;

  public constructor(dataSource: DataSource) {
    super(Category_product, dataSource.manager);

    this.category_productRepository =
      dataSource.getRepository(Category_product);
  }

  public findCategoriesProductByShop(
    shopId: number
  ): Promise<Category_product[]> {
    return this.createQueryBuilder('category_product')
      .leftJoin('category_product.shops', 'shop')
      .where('shop.id = :id', { id: shopId })
      .getMany();
  }

  public findCategoriesProductByIds(
    categoriesProductIds: number[]
  ): Promise<Category_product[]> {
    return this.createQueryBuilder('category_product')
      .where('category_product.id IN (:...ids)', {
        ids: categoriesProductIds
      })
      .getMany();
  }

  public findCategoriesProductOfOneProduct(
    productId: number
  ): Promise<Category_product[]> {
    return this.createQueryBuilder('category_product')
      .leftJoin('category_product.products', 'product')
      .where('product.id = :id', { id: productId })
      .getMany();
  }
}
