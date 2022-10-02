import { AppDataSource } from '../app-data-source';
import { Product } from '../entities/product';

export const ProductRepository = AppDataSource.getRepository(Product).extend(
  {}
);
