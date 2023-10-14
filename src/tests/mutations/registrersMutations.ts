export const signUpArtisanMutation = `
mutation SignUpArtisan($createArtisanInput: CreateArtisanInput!) {
    signUpArtisan(CreateArtisanInput: $createArtisanInput) {
      accessToken
    }
  }
`;

export const signUpClientMutation = `
mutation SignUpClient($createClientInput: CreateClientInput!) {
  signUpClient(CreateClientInput: $createClientInput) {
    accessToken
  }
}
`;

export const signInMutation = `mutation SignIn($connectUser: ConnectUser!) {
  signIn(ConnectUser: $connectUser) {
    accessToken
  }
}`;
