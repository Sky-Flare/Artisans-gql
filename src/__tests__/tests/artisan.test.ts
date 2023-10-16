import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import { gqlHelper } from '@src/__tests__/helpers/gCall';
import {
  DeleteArtisanDocument,
  DeleteArtisanMutation,
  MeArtisanDocument,
  MeArtisanQuery,
  UpdateArtisanDocument,
  UpdateArtisanMutation
} from '../../generated/graphql';
import { Role } from '@entity/generic/user';
import { initializeDataSource } from '@src/__tests__/config/dataSource';
import { createArtisan, singIn } from '@src/__tests__/helpers/registrer';

let dataSource: DataSource;
let token = '';
beforeAll(async (): Promise<DataSource> => {
  dataSource = await initializeDataSource();
  await createArtisan(artisanFaker);
  const { response } = await singIn({
    email: artisanFaker.email,
    password: artisanFaker.password,
    role: Role.ARTISAN
  });
  token = response.data?.signIn?.accessToken ?? '';
  return dataSource;
});

const artisanFaker = {
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
  describe('meArtisan query', () => {
    it('Should return me artisan', async () => {
      const meArtisanResponse = await gqlHelper<MeArtisanQuery>({
        source: MeArtisanDocument,
        contextValue: token
      });
      expect(meArtisanResponse).toBeDefined();
      expect(meArtisanResponse.data).toBeDefined();
      expect(meArtisanResponse.data?.meArtisan).toBeDefined();
      expect(meArtisanResponse.data?.meArtisan?.email).toBe(artisanFaker.email);
    });
  });
  describe('updateArtisan mutation', () => {
    it('Should update me artisan', async () => {
      artisanFaker.lastName = 'new last name';
      const updateArtisanResponse = await gqlHelper<UpdateArtisanMutation>({
        source: UpdateArtisanDocument,
        variableValues: {
          createArtisanInput: artisanFaker
        },
        contextValue: token
      });
      expect(updateArtisanResponse).toBeDefined();
      expect(updateArtisanResponse.data).toBeDefined();
      expect(updateArtisanResponse.data?.updateArtisan.lastName).toBeDefined();
      expect(updateArtisanResponse.data?.updateArtisan.lastName).toBe(
        'new last name'
      );
    });
  });
  describe('deleteArtisan mutation', () => {
    it('Should delete artisan', async () => {
      const deleteArtisanResponse = await gqlHelper<DeleteArtisanMutation>({
        source: DeleteArtisanDocument,
        contextValue: token
      });
      expect(deleteArtisanResponse.data?.deleteArtisan).toBeTruthy();
      const meArtisanResponse = await gqlHelper<MeArtisanQuery>({
        source: MeArtisanDocument,
        contextValue: token
      });
      expect(meArtisanResponse.data?.meArtisan).toBeDefined();
    });
  });
});