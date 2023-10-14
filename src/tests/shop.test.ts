import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import { gqlHelper } from '@src/test-utils/gCall';
import { Artisan, Category_Shop, Days } from '../generated/graphql';
import { Role } from '@entity/generic/user';
import { initializeDataSource } from '@src/test-utils/dataSource';
import { meArtisanQuery } from '@src/tests/queries/artisanQueries';
import { createArtisan, singIn } from '@src/test-utils/helpers/registrer';
import {
  deleteArtisanMutation,
  updateArtisanMutation
} from '@src/tests/mutations/artisanMutations';
import { createShopMutation } from '@src/tests/mutations/shopMutations';
import { createCategoryShopMutation } from '@src/tests/mutations/category_shopMutations';

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
  await gqlHelper({
    source: createCategoryShopMutation,
    variableValues: {
      categoryShopInput: {
        name: 'Boulangerie',
        picture: faker.image.url()
      }
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
  categoriesIds: [1],
  city: faker.location.city(),
  description: faker.lorem.text(),
  name: faker.company.name(),
  siretNumber: '',
  zipCode: Number(faker.location.zipCode())
};
describe('Shop', () => {
  describe('createShop mutation', () => {
    it('Should throw error siren require', async () => {
      const createShopResponse = (await gqlHelper({
        source: createShopMutation,
        variableValues: {
          createShopInput: shopFaker
        },
        contextValue: token
      })) as {
        errors?: [{ message: string }];
      };
      expect(createShopResponse.errors?.[0].message).toContain('Siren requier');
    });
    it('Should throw error Category required', async () => {
      shopFaker.categoriesIds = [];
      shopFaker.siretNumber = '56789';
      const createShopResponse = (await gqlHelper({
        source: createShopMutation,
        variableValues: {
          createShopInput: shopFaker
        },
        contextValue: token
      })) as {
        errors?: [{ message: string }];
      };
      expect(createShopResponse.errors?.[0].message).toContain(
        'Category required'
      );
    });
    it('Should throw error Category not found', async () => {
      shopFaker.categoriesIds = [2];
      const createShopResponse = (await gqlHelper({
        source: createShopMutation,
        variableValues: {
          createShopInput: shopFaker
        },
        contextValue: token
      })) as {
        errors?: [{ message: string }];
      };
      expect(createShopResponse.errors?.[0].message).toContain(
        'Category not found'
      );
    });
    it('Should create shop', async () => {
      shopFaker.categoriesIds = [1];
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
      const createShopResponse = (await gqlHelper({
        source: createShopMutation,
        variableValues: {
          createShopInput: shopFaker,
          inputHoraireShop: inputHoraireShop
        },
        contextValue: token
      })) as {
        data: {
          createShop: { name: string };
        };
      };
      expect(createShopResponse.data.createShop.name).toBe(shopFaker.name);
    });
  });
});
