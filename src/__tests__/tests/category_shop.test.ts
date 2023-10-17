import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import { gqlHelper } from '@src/__tests__/helpers/gCall';
import {
  CategoriesShopDocument,
  CategoriesShopQuery,
  CreateCategoryShopDocument,
  CreateCategoryShopMutation,
  CreateCategoryShopMutationVariables,
  Role
} from '../../generated/graphql';
import { initializeDataSource } from '@src/__tests__/config/dataSource';
import { createArtisan, singIn } from '@src/__tests__/helpers/registrer';

let dataSource: DataSource;
let token = '';
beforeAll(async (): Promise<DataSource> => {
  dataSource = await initializeDataSource();
  await createArtisan(artisanFaker);
  const { response } = await singIn({
    email: artisanFaker.email,
    password: artisanFaker.password,
    role: Role.Artisan
  });
  token = response.data?.signIn?.accessToken ?? '';
  return dataSource;
});

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

afterAll(async () => dataSource.destroy());
describe('Category_shop', () => {
  describe('createCategoryShop mutation', () => {
    it('should create a category_shop', async () => {
      const imgUrl = faker.image.url();
      const creatCategoryShopResponse = await gqlHelper<
        CreateCategoryShopMutation,
        CreateCategoryShopMutationVariables
      >({
        source: CreateCategoryShopDocument,
        variableValues: {
          categoryShopInput: {
            name: 'Boulangerie',
            picture: imgUrl
          }
        },
        contextValue: token
      });
      expect(creatCategoryShopResponse.data?.createCategoryShop.name).toBe(
        'Boulangerie'
      );
      expect(creatCategoryShopResponse.data?.createCategoryShop.picture).toBe(
        imgUrl
      );
    });
  });
  describe('categories_shop query', () => {
    it('should return all categories shop', async () => {
      const categoriesShopResponse = await gqlHelper<CategoriesShopQuery>({
        source: CategoriesShopDocument,
        contextValue: token
      });
      expect(categoriesShopResponse.data?.categories_shop.length).toBe(1);
      expect(categoriesShopResponse.data?.categories_shop[0].name).toBe(
        'Boulangerie'
      );
      await gqlHelper<
        CreateCategoryShopMutation,
        CreateCategoryShopMutationVariables
      >({
        source: CreateCategoryShopDocument,
        variableValues: {
          categoryShopInput: {
            name: 'Patisserie',
            picture: faker.image.url()
          }
        },
        contextValue: token
      });
      const categoriesShopResponseTwo = await gqlHelper<CategoriesShopQuery>({
        source: CategoriesShopDocument,
        contextValue: token
      });
      expect(categoriesShopResponseTwo.data?.categories_shop.length).toBe(2);
      expect(categoriesShopResponseTwo.data?.categories_shop[1].name).toBe(
        'Patisserie'
      );
    });
  });
});
