import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';

import { gqlHelper } from '@src/test-utils/gCall';
import { LoginResponse } from '../generated/graphql';
import { Role } from '@entity/generic/user';
import { initializeDataSource } from '@src/test-utils/dataSource';
let dataSource: DataSource;

beforeAll(async (): Promise<DataSource> => {
  dataSource = await initializeDataSource();
  return dataSource;
});

afterAll(async () => dataSource.destroy());

export const signUpArtisanMutation = `
mutation SignUpArtisan($createArtisanInput: CreateArtisanInput!) {
    signUpArtisan(CreateArtisanInput: $createArtisanInput) {
      accessToken
    }
  }
`;
const signUpClientMutation = `
mutation SignUpClient($createClientInput: CreateClientInput!) {
  signUpClient(CreateClientInput: $createClientInput) {
    accessToken
  }
}
`;
const signInMutation = `mutation SignIn($connectUser: ConnectUser!) {
  signIn(ConnectUser: $connectUser) {
    accessToken
  }
}`;
const artisan = {
  lastName: faker.person.lastName(),
  firstName: faker.person.firstName(),
  email: faker.internet.email(),
  adress: faker.location.streetAddress(),
  zipCode: Number(faker.location.zipCode()),
  city: faker.location.city(),
  password: faker.internet.password(),
  sirenNumber: '309192144'
};
const client = {
  lastName: faker.person.lastName(),
  firstName: faker.person.firstName(),
  email: faker.internet.email(),
  adress: faker.location.streetAddress(),
  zipCode: Number(faker.location.zipCode()),
  city: faker.location.city(),
  password: faker.internet.password()
};

describe('Register', () => {
  describe('SignUpArtisan', () => {
    it('should create a artisan', async () => {
      const response = (await gqlHelper({
        source: signUpArtisanMutation,
        variableValues: {
          createArtisanInput: artisan
        }
      })) as { data: { signUpArtisan: LoginResponse } };
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.data.signUpArtisan).toBeDefined();
      expect(response.data.signUpArtisan.accessToken).toBeDefined();
    });
  });
});
