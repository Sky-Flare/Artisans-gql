import { Cart } from '@entity/cart';
import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';

@Service()
export class CartRepository extends Repository<Cart> {
  private readonly cartRepository: Repository<Cart>;

  public constructor(dataSource: DataSource) {
    super(Cart, dataSource.manager);

    this.cartRepository = dataSource.getRepository(Cart);
  }
}
