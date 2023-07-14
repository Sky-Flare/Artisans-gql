import { Connection } from 'typeorm';

import { testConn } from '@src/test-utils/testConn';
import { gCall } from '@src/test-utils/gCall';
import { LoginResponse } from '../generated/graphql';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  await conn.destroy();
});

const registerMutation = `
mutation SignUpArtisan($createArtisanInput: CreateArtisanInput!) {
    signUpArtisan(CreateArtisanInput: $createArtisanInput) {
      accessToken
    }
  }
`;
const artisan = {
  lastName: 'lebaad',
  firstName: 'joss',
  email: 'test@gmail.com',
  adress: '37 route de la covasserie',
  zipCode: 74420,
  city: 'habere-poche',
  password: 'test',
  sirenNumber: '309192144'
};
const client = {
  lastName: 'clientLastName',
  firstName: 'clientFirstName',
  email: 'test@gmail.com',
  adress: '37 route de la covasserie',
  zipCode: 74420,
  city: 'habere-poche',
  password: 'test'
};

describe('Register', () => {
  describe('SignUpArtisan', () => {
    it('should create a user', async () => {
      const response = (await gCall({
        source: registerMutation,
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
        source: registerMutation,
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
        source: registerMutation,
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
      }).toThrowError(/Duplicate entry 'test@gmail.com'/);
    });
    it('should throw an error if Siren is not found', async () => {
      artisan.sirenNumber = '123456789';
      const response = await gCall({
        source: registerMutation,
        variableValues: {
          createClientInput: client
        }
      });
      expect(response).toBeDefined();
      expect(response.errors).toBeDefined();
      expect(response.errors?.[0].message).toBe('Siren not found');
    });
  });
  describe('SignUpClient', () => {
    it('should create a user', async () => {
      const response = (await gCall({
        source: registerMutation,
        variableValues: {
          createClientInput: client
        }
      })) as { data: { signUpArtisan: LoginResponse } };
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.data.signUpArtisan).toBeDefined();
      expect(response.data.signUpArtisan.accessToken).toBeDefined();
    });
    it('should throw an error if email is already used', async () => {
      const response = await gCall({
        source: registerMutation,
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
      }).toThrowError();
    });
  });
});
