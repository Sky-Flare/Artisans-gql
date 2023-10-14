export const updateArtisanMutation = `
mutation UpdateArtisan($createArtisanInput: CreateArtisanInput!) {
  updateArtisan(CreateArtisanInput: $createArtisanInput) {
    lastName
  }
}`;

export const deleteArtisanMutation = `
mutation Mutation {
  deleteArtisan
}`;
