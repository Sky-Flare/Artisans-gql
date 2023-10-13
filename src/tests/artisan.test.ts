import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import { gqlHelper } from '@src/test-utils/gCall';
import { Artisan } from '../generated/graphql';
import { Role } from '@entity/generic/user';
import { initializeDataSource } from '@src/test-utils/dataSource';
import { meArtisanQuery } from '@src/tests/queries/artisanQueries';
import { createArtisan, singIn } from '@src/test-utils/helpers/registrer';

let dataSource: DataSource;
let token = '';
beforeAll(async (): Promise<DataSource> => {
  dataSource = await initializeDataSource();
  await createArtisan(artisan);
  const { response } = await singIn({
    email: artisan.email,
    password: artisan.password,
    role: Role.ARTISAN
  });
  token = response.data.signIn.accessToken;
  return dataSource;
});

const artisan = {
  lastName: faker.person.lastName(),
  firstName: faker.person.firstName(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  zipCode: Number(faker.location.zipCode()),
  city: faker.location.city(),
  password: faker.internet.password(),
  sirenNumber: '409937604'
};

afterAll(async () => dataSource.destroy());
describe('Artisan', () => {
  describe('Me artisan query', () => {
    it('Should return me artisan', async () => {
      const meArtisanResponse = (await gqlHelper({
        source: meArtisanQuery,
        contextValue: {
          req: {
            headers: {
              authorization: token
            }
          }
        }
      })) as { data: { meArtisan: Artisan } };
      expect(meArtisanResponse).toBeDefined();
      expect(meArtisanResponse.data).toBeDefined();
      expect(meArtisanResponse.data.meArtisan).toBeDefined();
      expect(meArtisanResponse.data.meArtisan.email).toBe(artisan.email);
    });
  });
});
