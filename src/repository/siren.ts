import { Artisan } from '@entity/artisan';
import axios from 'axios';
import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { Siren } from '@entity/siren';

@Service()
class SirenRepository extends Repository<Siren> {
  private readonly sirenRepository: Repository<Siren>;

  public constructor(dataSource: DataSource) {
    super(Siren, dataSource.manager);

    this.sirenRepository = dataSource.getRepository(Siren);
  }

  public async checkSiren(sirenNumber: string) {
    return await axios.get(
      `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenNumber}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.JWT_SIREN}`,
          Accept: 'application/json'
        }
      }
    );
  }
}

export { SirenRepository };
