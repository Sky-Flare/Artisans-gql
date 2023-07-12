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

describe('Register', () => {
  it('create user', async () => {
    const user = {
      adress: '37 route de la covasserie',
      city: 'habere-poche',
      email: 'test@gmail.com',
      firstName: 'joss',
      password: 'test',
      lastName: 'lebaad',
      sirenNumber: '309192144',
      zipCode: 74420
    };

    const response = (await gCall({
      source: registerMutation,
      variableValues: {
        createArtisanInput: user
      }
    })) as { data: { signUpArtisan: LoginResponse } };
    expect(response?.data?.signUpArtisan?.accessToken).toBeDefined();
  });
});
