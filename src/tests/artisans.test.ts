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
  adress: '37 route de la covasserie',
  city: 'habere-poche',
  email: 'test@gmail.com',
  firstName: 'joss',
  password: 'test',
  lastName: 'lebaad',
  sirenNumber: '309192144',
  zipCode: 74420
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
  });
});
