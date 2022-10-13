import { AppDataSource } from "../app-data-source";
import { Product } from "../entities/product";

export const ProductRepository = AppDataSource.getRepository(Product).extend({
  findProductsOfShop(shopId: number): Promise<Product[]> {
    return this.createQueryBuilder("product")
      .leftJoin("product.shops", "shop")
      .where("shop.id = :id", { id: shopId })
      .getMany();
  }
});
