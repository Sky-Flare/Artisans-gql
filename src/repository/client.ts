import { Client } from '@entity/client';
import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';

@Service()
export class ClientRepository extends Repository<Client> {
  private readonly sirenRepository: Repository<Client>;

  public constructor(dataSource: DataSource) {
    super(Client, dataSource.manager);

    this.sirenRepository = dataSource.getRepository(Client);
  }
}
