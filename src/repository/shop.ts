import { Shop } from '@entity/shop';
import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';

@Service()
export class ShopRepository extends Repository<Shop> {
  private readonly shopRepository: Repository<Shop>;

  public constructor(dataSource: DataSource) {
    super(Shop, dataSource.manager);

    this.shopRepository = dataSource.getRepository(Shop);
  }

  public findByCategoriesShopWithZipCodes(
    zipCodes: number[],
    categoriesIds: number[]
  ): Promise<Shop[]> {
    return this.createQueryBuilder('shop')
      .leftJoin('shop.categoriesShops', 'category_shop')
      .where('category_shop.id IN (:...catIds)', {
        catIds: categoriesIds
      })
      .andWhere('shop.zipCode IN (:zipCodesNumber)', {
        zipCodesNumber: zipCodes
      })
      .getMany();
  }
  public findByZipCodes(zipCodes: number[]): Promise<Shop[]> {
    return this.createQueryBuilder('shop')
      .where('shop.zipCode IN (:zipCodesNumber)', {
        zipCodesNumber: zipCodes
      })
      .getMany();
  }
  public findByShopsIds(
    shopsIds: number[],
    artisanId: number
  ): Promise<Shop[]> {
    return this.createQueryBuilder('shop')
      .leftJoin('shop.artisan', 'artisan')
      .leftJoinAndSelect('shop.categoriesProducts', 'category_product')
      .where('shop.id IN (:...shopsIds)', {
        shopsIds: shopsIds
      })
      .andWhere('artisan.id = :artisanId', { artisanId: artisanId })
      .getMany();
  }
  public findByProductId(productId: number): Promise<Shop[]> {
    return this.createQueryBuilder('shop')
      .leftJoin('shop.products', 'product')
      .where('product.id = :id', { id: productId })
      .getMany();
  }

  public findShopByCategoryProduct(categoryProductId: number): Promise<Shop[]> {
    return this.createQueryBuilder('shop')
      .leftJoin('shop.categoriesShops', 'category_shop')
      .where('category_shop.id = :id', { id: categoryProductId })
      .getMany();
  }
}
