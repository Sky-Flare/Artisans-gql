import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import { gqlHelper } from '@src/test-utils/gCall';
import { Category_Shop } from '../generated/graphql';
import { Role } from '@entity/generic/user';
import { initializeDataSource } from '@src/test-utils/dataSource';
import { createArtisan, singIn } from '@src/test-utils/helpers/registrer';

import {
  categoriesShopQuery,
  createCategoryShopMutation
} from '@src/tests/mutations/category_shopMutations';

let dataSource: DataSource;
let token = '';
beforeAll(async (): Promise<DataSource> => {
  dataSource = await initializeDataSource();
  await createArtisan(artisanFaker);
  const { response } = await singIn({
    email: artisanFaker.email,
    password: artisanFaker.password,
    role: Role.ARTISAN
  });
  token = response.data.signIn.accessToken;
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
    it('Should create a category_shop', async () => {
      const imgUrl = faker.image.url();
      const creatCategoryShopResponse = (await gqlHelper({
        source: createCategoryShopMutation,
        variableValues: {
          categoryShopInput: {
            name: 'Boulangerie',
            picture: imgUrl
          }
        },
        contextValue: token
      })) as { data: { createCategoryShop: Partial<Category_Shop> } };
      expect(creatCategoryShopResponse.data.createCategoryShop.name).toBe(
        'Boulangerie'
      );
      expect(creatCategoryShopResponse.data.createCategoryShop.picture).toBe(
        imgUrl
      );
    });
  });
  describe('categories_shop query', () => {
    it('should return all categories shop', async () => {
      const categoriesShopResponse = (await gqlHelper({
        source: categoriesShopQuery,
        contextValue: token
      })) as { data: { categories_shop: Category_Shop[] } };
      expect(categoriesShopResponse.data.categories_shop.length).toBe(1);
      expect(categoriesShopResponse.data.categories_shop[0].name).toBe(
        'Boulangerie'
      );
      await gqlHelper({
        source: createCategoryShopMutation,
        variableValues: {
          categoryShopInput: {
            name: 'Patisserie',
            picture: faker.image.url()
          }
        },
        contextValue: token
      });
      const categoriesShopResponseTwo = (await gqlHelper({
        source: categoriesShopQuery,
        contextValue: token
      })) as { data: { categories_shop: Category_Shop[] } };
      expect(categoriesShopResponseTwo.data.categories_shop.length).toBe(2);
      expect(categoriesShopResponseTwo.data.categories_shop[1].name).toBe(
        'Patisserie'
      );
    });
  });
});
