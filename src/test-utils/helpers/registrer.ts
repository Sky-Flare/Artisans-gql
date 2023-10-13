import { gqlHelper } from '@src/test-utils/gCall';
import {
  signUpArtisanMutation,
  signUpClientMutation
} from '@src/tests/queries/registrersMutations';
import { fakerFR as faker } from '@faker-js/faker';
import { ConnectUser, Role } from '@entity/generic/user';
import { LoginResponse } from '@src/generated/graphql';

type ArtisanFaker = {
  lastName: string;
  firstName: string;
  email: string;
  address: string;
  zipCode: number;
  city: string;
  password: string;
  sirenNumber: string;
};

type ClientFaker = {
  lastName: string;
  firstName: string;
  email: string;
  address: string;
  zipCode: number;
  city: string;
  password: string;
};

export async function createArtisan(artisan: ArtisanFaker) {
  const response = (await gqlHelper({
    source: signUpArtisanMutation,
    variableValues: {
      createArtisanInput: artisan
    }
  })) as {
    data: { signUpArtisan: LoginResponse };
    errors?: [{ message: string }];
  };
  return { response, artisan };
}

export async function createClient(client: ClientFaker) {
  const response = (await gqlHelper({
    source: signUpClientMutation,
    variableValues: {
      createClientInput: client
    }
  })) as {
    data: { signUpClient: LoginResponse };
    errors?: [{ message: string }];
  };
  return { response, client };
}

export async function singIn(data: ConnectUser) {
  const response = (await gqlHelper({
    source: `mutation SingIn($connectUser: ConnectUser!) {
                     signIn(ConnectUser: $connectUser) {
                        accessToken
                     }
                }`,
    variableValues: {
      connectUser: {
        email: data.email,
        password: data.password,
        role: data.role
      }
    }
  })) as { data: { signIn: LoginResponse }; errors?: [{ message: string }] };
  return { response };
}
