import { DataSource} from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';

import { testConn } from '@src/test-utils/testConn';
import { gCall } from '@src/test-utils/gCall';
import { LoginResponse } from '../generated/graphql';
import { Role } from '@entity/generic/user';

let conn: DataSource;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  if (conn.isInitialized) {
    await conn.destroy();
  }
});

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
      const response = (await gCall({
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
    it('should throw an error if Siren is already used', async () => {
      const response = await gCall({
        source: signUpArtisanMutation,
        variableValues: {
          createArtisanInput: artisan
        }
      });
      expect(response).toBeDefined();
      expect(response.errors).toBeDefined();
      expect(response.errors?.[0].message).toBe('Siren already use');
    });
    it('should throw an error artisan aready exist', async () => {
      artisan.sirenNumber = '350511945';
      const response = await gCall({
        source: signUpArtisanMutation,
        variableValues: {
          createArtisanInput: artisan
        }
      });
      expect(response).toBeDefined();
      expect(response.errors).toBeDefined();
      expect(() => {
        if (response.errors) {
          throw new Error(response.errors[0].message);
        } else {
          throw new Error('Expected response to have errors');
        }
      }).toThrowError(`Duplicate entry '${artisan.email}'`);
    });
    it('should throw an error if Siren is not found', async () => {
      artisan.sirenNumber = '123456789';
      const response = await gCall({
        source: signUpArtisanMutation,
        variableValues: {
          createArtisanInput: artisan
        }
      });
      expect(response).toBeDefined();
      expect(response.errors).toBeDefined();
      expect(response.errors?.[0].message).toBe('Siren not found');
    });
  });

  describe('SignUpClient', () => {
    it('should create a client', async () => {
      const response = (await gCall({
        source: signUpClientMutation,
        variableValues: {
          createClientInput: client
        }
      })) as { data: { signUpClient: LoginResponse } };
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.data.signUpClient).toBeDefined();
      expect(response.data.signUpClient.accessToken).toBeDefined();
    });
    it('should throw an error if email is already used for client', async () => {
      const response = await gCall({
        source: signUpClientMutation,
        variableValues: {
          createClientInput: client
        }
      });
      expect(response).toBeDefined();
      expect(response.errors).toBeDefined();
      expect(() => {
        if (response.errors) {
          throw new Error(response.errors[0].message);
        } else {
          throw new Error('Expected response to have errors');
        }
      }).toThrowError(`Duplicate entry '${client.email}'`);
    });
  });

  describe('SignIn', () => {
    it('should authenticate a artisan with correct credentials', async () => {
      const response = (await gCall({
        source: signInMutation,
        variableValues: {
          connectUser: {
            email: artisan.email,
            password: artisan.password,
            role: Role.ARTISAN
          }
        }
      })) as { data: { signIn: LoginResponse } };
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.data.signIn).toBeDefined();
      expect(response.data.signIn.accessToken).toBeDefined();
    });
    it('should throw an error for incorrect credentials artisan', async () => {
      const response = await gCall({
        source: signInMutation,
        variableValues: {
          connectUser: {
            email: artisan.email,
            password: 'wrong password',
            role: Role.ARTISAN
          }
        }
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
      const response = (await gCall({
        source: signInMutation,
        variableValues: {
          connectUser: {
            email: client.email,
            password: client.password,
            role: Role.CLIENT
          }
        }
      })) as { data: { signIn: LoginResponse } };
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.data.signIn).toBeDefined();
      expect(response.data.signIn.accessToken).toBeDefined();
    });
    it('should throw an error for unknown user', async () => {
      const response = await gCall({
        source: signInMutation,
        variableValues: {
          connectUser: {
            email: 'fds@example.com',
            password: 'test',
            role: Role.CLIENT
          }
        }
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
