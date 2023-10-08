import { Connection } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';

import { testConn } from '@src/test-utils/testConn';
import { gCall } from '@src/test-utils/gCall';
import { LoginResponse } from '../generated/graphql';
import { Role } from '@entity/generic/user';
import {signUpArtisanMutation} from "@src/tests/registrer.test";
let token: string;
let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  if (conn.isInitialized) {
  await conn.destroy();
  }
});

const meArtisanQuery = `
query MeArtisan {
    meArtisan {
      adress
      city
      email
      firstName
      lastName
      updatedAt
      zipCode
    }
  }
`;
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

describe('Artisan', () => {
  describe('meArtisan', () => {
    it('should return artisan connected', async () => {
      const {data} = await gCall({
        source: signUpArtisanMutation,
        variableValues: {
          createArtisanInput: artisan
        }
      }) as { data: { signUpArtisan: LoginResponse } }
      if (data?.signUpArtisan?.accessToken) {
        token = data.signUpArtisan.accessToken
      }
      const response = await gCall({
        source: meArtisanQuery,
        token: token,
      });
      console.log(response);
    });
  });
});
