import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import { gqlHelper } from '@src/__tests__/helpers/gCall';
import {
  Categories_ProductByShopDocument,
  Categories_ProductByShopQuery,
  Categories_ProductByShopQueryVariables,
  CreateCategoryProductDocument,
  CreateCategoryProductMutation,
  CreateCategoryProductMutationVariables,
  CreateCategoryShopDocument,
  CreateCategoryShopMutation,
  CreateCategoryShopMutationVariables,
  CreateShopDocument,
  CreateShopMutation,
  CreateShopMutationVariables,
  Days,
  Role
} from '../../generated/graphql';
import { initializeDataSource } from '@src/__tests__/config/dataSource';
import {
  createArtisan,
  signIn
} from '@src/__tests__/helpers/registrer';

let dataSource: DataSource;
let token = '';
beforeAll(async (): Promise<DataSource> => {
  dataSource = await initializeDataSource();
  await createArtisan(artisanFaker);
  const { response } = await signIn({
    email: artisanFaker.email,
    password: artisanFaker.password,
    role: Role.Artisan
  });
  token = response.data?.signIn?.accessToken ?? '';
  await gqlHelper<
    CreateCategoryShopMutation,
    CreateCategoryShopMutationVariables
  >({
    source: CreateCategoryShopDocument,
    variableValues: {
      categoryShopInput: {
        name: 'Boulangerie',
        picture: faker.image.url()
      }
    },
    contextValue: token
  });
  await gqlHelper<CreateShopMutation, CreateShopMutationVariables>({
    source: CreateShopDocument,
    variableValues: {
      createShopInput: shopFaker,
      inputHoraireShop: inputHoraireShop
    },
    contextValue: token
  });
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
  sirenNumber: '409937604'
};
const shopFaker = {
  address: faker.location.streetAddress(),
  shopCategoriesIds: [1],
  city: faker.location.city(),
  description: faker.lorem.text(),
  name: faker.company.name(),
  siretNumber: '345445',
  zipCode: Number(faker.location.zipCode())
};
const inputHoraireShop = [
  Days.Monday,
  Days.Tuesday,
  Days.Wednesday,
  Days.Thursday
].map((day) => {
  return {
    dayId: day,
    timeAmEnd: '8h',
    timeAmStart: '12h',
    timePmEnd: '13h',
    timePmStart: '18h'
  };
});
describe('Category_product', () => {
  describe('createCategoryProduct mutation', () => {
    it('should create category product with shopsId', async () => {
      const createShopResponse = await gqlHelper<
        CreateCategoryProductMutation,
        CreateCategoryProductMutationVariables
      >({
        source: CreateCategoryProductDocument,
        variableValues: {
          categoryProductInput: {
            name: 'Pain',
            picture: faker.image.url(),
            shopsIds: [1]
          }
        },
        contextValue: token
      });
      expect(createShopResponse.data?.createCategoryProduct.name).toBe('Pain');
      const Categories_productByShopResponse = await gqlHelper<
        Categories_ProductByShopQuery,
        Categories_ProductByShopQueryVariables
      >({
        source: Categories_ProductByShopDocument,
        variableValues: {
          shopId: 1
        },
        contextValue: token
      });
      expect(
        Categories_productByShopResponse.data?.categories_productByShop[0].name
      ).toBe('Pain');
    });
    it('should create category product without shopsId', async () => {
      const createShopResponse = await gqlHelper<
        CreateCategoryProductMutation,
        CreateCategoryProductMutationVariables
      >({
        source: CreateCategoryProductDocument,
        variableValues: {
          categoryProductInput: {
            name: 'Patisserie',
            picture: faker.image.url()
          }
        },
        contextValue: token
      });
      expect(createShopResponse.data?.createCategoryProduct.name).toBe(
        'Patisserie'
      );
    });
  });
});
