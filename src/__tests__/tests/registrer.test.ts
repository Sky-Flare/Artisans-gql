import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import { initializeDataSource } from '@src/__tests__/config/dataSource';
import {
  createArtisan,
  createClient,
  signIn
} from '@src/__tests__/helpers/registrer';
import { Role } from '@src/generated/graphql';

let dataSource: DataSource;

beforeAll(async (): Promise<DataSource> => {
  dataSource = await initializeDataSource();
  return dataSource;
});

afterAll(async () => dataSource.destroy());

const artisanFaker = {
  lastName: faker.person.lastName(),
  firstName: faker.person.firstName(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  zipCode: Number(faker.location.zipCode()),
  city: faker.location.city(),
  password: faker.internet.password(),
  sirenNumber: '309192144'
};
const clientFaker = {
  lastName: faker.person.lastName(),
  firstName: faker.person.firstName(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  zipCode: Number(faker.location.zipCode()),
  city: faker.location.city(),
  password: faker.internet.password()
};
describe('Register', () => {
  describe('signUpArtisan mutation', () => {
    it('should create a artisan', async () => {
      const { response } = await createArtisan(artisanFaker);
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.data?.signUpArtisan).toBeDefined();
      expect(response.data?.signUpArtisan?.accessToken).toBeDefined();
    });
    it('should throw an error if Siren is already used', async () => {
      const { response } = await createArtisan(artisanFaker);
      expect(response).toBeDefined();
      expect(response.errors).toBeDefined();
      expect(response.errors?.[0]?.message).toBe('Siren already use');
    });
    it('should throw an error artisan aready exist', async () => {
      artisanFaker.sirenNumber = '350511945';
      const { response } = await createArtisan(artisanFaker);
      expect(response).toBeDefined();
      expect(response.errors).toBeDefined();
      expect(() => {
        if (response.errors) {
          throw new Error(response.errors[0].message);
        } else {
          throw new Error('Expected response to have errors');
        }
      }).toThrowError(`Duplicate entry '${artisanFaker.email}'`);
    });
    it('should throw an error if Siren is not found', async () => {
      artisanFaker.sirenNumber = '123456789';
      const { response } = await createArtisan(artisanFaker);
      expect(response).toBeDefined();
      expect(response.errors).toBeDefined();
      expect(response.errors?.[0].message).toBe('Siren not found');
    });
  });

  describe('signUpClient mutation', () => {
    it('should create a client', async () => {
      const { response } = await createClient(clientFaker);
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.data?.signUpClient).toBeDefined();
      expect(response.data?.signUpClient?.accessToken).toBeDefined();
    });
    it('should throw an error if email is already used for client', async () => {
      const { response } = await createClient(clientFaker);
      expect(response).toBeDefined();
      expect(response.errors).toBeDefined();
      expect(() => {
        if (response.errors) {
          throw new Error(response.errors[0].message);
        } else {
          throw new Error('Expected response to have errors');
        }
      }).toThrowError(`Duplicate entry '${clientFaker.email}'`);
    });
  });

  describe('signIn mutation', () => {
    it('should authenticate a artisan with correct credentials', async () => {
      const { response } = await signIn({
        email: artisanFaker.email,
        password: artisanFaker.password,
        role: Role.Artisan
      });
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.data?.signIn).toBeDefined();
      expect(response.data?.signIn?.accessToken).toBeDefined();
    });
    it('should throw an error for incorrect credentials artisan', async () => {
      const { response } = await signIn({
        email: artisanFaker.email,
        password: 'not my password',
        role: Role.Artisan
      });
      expect(response).toBeDefined();
      expect(response.errors).toBeDefined();
      if (response.errors) {
        expect(response.errors[0].message).toBe('Bad credentials');
      } else {
        // Handle the case where response.errors is undefined
        throw new Error('Expected response to have errors');
      }
    });
    it('should authenticate a client with correct credentials', async () => {
      const { response } = await signIn({
        email: clientFaker.email,
        password: clientFaker.password,
        role: Role.Client
      });
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.data?.signIn).toBeDefined();
      expect(response.data?.signIn?.accessToken).toBeDefined();
    });
    it('should throw an error for unknown user', async () => {
      const { response } = await signIn({
        email: 'notgood@email.com',
        password: clientFaker.password,
        role: Role.Client
      });
      expect(response).toBeDefined();
      expect(response.errors).toBeDefined();
      if (response.errors) {
        expect(response.errors[0].message).toBe('Utilisateur non identifié');
      } else {
        throw new Error('Expected response to have errors');
      }
    });
  });
});
