import { gqlHelper } from '@src/__tests__/helpers/gCall';
import { ConnectUser } from '@entity/generic/user';
import {
  SignInDocument,
  SignInMutation,
  SignUpArtisanDocument,
  SignUpArtisanMutation,
  SignUpClientDocument,
  SignUpClientMutation
} from '@src/generated/graphql';

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
  const response = await gqlHelper<SignUpArtisanMutation>({
    source: SignUpArtisanDocument,
    variableValues: {
      createArtisanInput: artisan
    }
  });
  return { response, artisan };
}

export async function createClient(client: ClientFaker) {
  const response = await gqlHelper<SignUpClientMutation>({
    source: SignUpClientDocument,
    variableValues: {
      createClientInput: client
    }
  });
  return { response, client };
}

export async function singIn(data: ConnectUser) {
  const response = await gqlHelper<SignInMutation>({
    source: SignInDocument,
    variableValues: {
      connectUser: {
        email: data.email,
        password: data.password,
        role: data.role
      }
    }
  });
  return { response };
}
