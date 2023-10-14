import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { Siret } from '@entity/siret';

@Service()
export class SiretRepository extends Repository<Siret> {
  private readonly siretRepository: Repository<Siret>;

  public constructor(dataSource: DataSource) {
    super(Siret, dataSource.manager);

    this.siretRepository = dataSource.getRepository(Siret);
  }
}
