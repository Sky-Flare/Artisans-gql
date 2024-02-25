import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import { gqlHelper } from '@src/__tests__/helpers/gCall';
import {
  ArtisanDocument,
  ArtisanQuery,
  ArtisanQueryVariables,
  ArtisansDocument,
  ArtisansQuery,
  DeleteArtisanDocument,
  DeleteArtisanMutation,
  MeArtisanDocument,
  MeArtisanQuery,
  MeClientDocument,
  MeClientQuery,
  Role,
  UpdateArtisanDocument,
  UpdateArtisanMutation,
  UpdateArtisanMutationVariables
} from '@src/generated/graphql';
import { initializeDataSource } from '@src/__tests__/config/dataSource';
import {
  createArtisan,
  createClient,
  signIn
} from '@src/__tests__/helpers/registrer';

let dataSource: DataSource;
let token = '';
beforeAll(async (): Promise<DataSource> => {
  dataSource = await initializeDataSource();
  await createClient(clientFaker);
  const { response } = await signIn({
    email: clientFaker.email,
    password: clientFaker.password,
    role: Role.Client
  });
  token = response.data?.signIn?.accessToken ?? '';
  return dataSource;
});

const clientFaker = {
  lastName: faker.person.lastName(),
  firstName: faker.person.firstName(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  zipCode: Number(faker.location.zipCode()),
  city: faker.location.city(),
  password: faker.internet.password()
};

afterAll(async () => dataSource.destroy());
describe('Client', () => {
  describe('meClient query', () => {
    it('should return me client', async () => {
      const meClientResponse = await gqlHelper<MeClientQuery>({
        source: MeClientDocument,
        contextValue: token
      });
      expect(meClientResponse).toBeDefined();
      expect(meClientResponse.data).toBeDefined();
      expect(meClientResponse.data?.meClient).toBeDefined();
      expect(meClientResponse.data?.meClient?.email).toBe(clientFaker.email);
    });
  });
});
