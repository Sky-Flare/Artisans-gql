import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import { gqlHelper } from '@src/__tests__/helpers/gCall';
import {
  CreateCategoryShopDocument,
  CreateCategoryShopMutation,
  CreateCategoryShopMutationVariables,
  CreateShopDocument,
  CreateShopMutation,
  CreateShopMutationVariables,
  Days,
  Role,
  ShopsDocument,
  ShopsQuery,
  ShopsQueryVariables
} from '../../generated/graphql';
import { initializeDataSource } from '@src/__tests__/config/dataSource';
import {
  createArtisan,
  createClient,
  singIn
} from '@src/__tests__/helpers/registrer';

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
  return dataSource;
});
afterAll(async () => dataSource.destroy());
const zipCodeArtisan = Number(faker.location.zipCode());
const zipCodeClient = Number(faker.location.zipCode());
const artisanFaker = {
  lastName: faker.person.lastName(),
  firstName: faker.person.firstName(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  zipCode: zipCodeArtisan,
  city: faker.location.city(),
  password: faker.internet.password(),
  sirenNumber: '409937604'
};
const clientFaker = {
  lastName: faker.person.lastName(),
  firstName: faker.person.firstName(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  zipCode: zipCodeClient,
  city: faker.location.city(),
  password: faker.internet.password()
};
const shopFaker = {
  address: faker.location.streetAddress(),
  categoriesIds: [1],
  city: faker.location.city(),
  description: faker.lorem.text(),
  name: faker.company.name(),
  siretNumber: '',
  zipCode: zipCodeArtisan
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
describe('Shop', () => {
  describe('createShop mutation', () => {
    it('Should throw error siret require', async () => {
      const createShopResponse = await gqlHelper<
        CreateShopMutation,
        CreateShopMutationVariables
      >({
        source: CreateShopDocument,
        variableValues: {
          createShopInput: shopFaker
        },
        contextValue: token
      });
      expect(createShopResponse.errors?.[0].message).toContain('Siret requier');
    });
    it('Should throw error Category required', async () => {
      shopFaker.categoriesIds = [];
      shopFaker.siretNumber = '56789';
      const createShopResponse = await gqlHelper<
        CreateShopMutation,
        CreateShopMutationVariables
      >({
        source: CreateShopDocument,
        variableValues: {
          createShopInput: shopFaker
        },
        contextValue: token
      });
      expect(createShopResponse.errors?.[0].message).toContain(
        'Category required'
      );
    });
    it('Should throw error Category not found', async () => {
      shopFaker.categoriesIds = [3];
      const createShopResponse = await gqlHelper<
        CreateShopMutation,
        CreateShopMutationVariables
      >({
        source: CreateShopDocument,
        variableValues: {
          createShopInput: shopFaker
        },
        contextValue: token
      });
      expect(createShopResponse.errors?.[0].message).toContain(
        'Category not found'
      );
    });
    it('Should create shop', async () => {
      shopFaker.categoriesIds = [1];

      const createShopResponse = await gqlHelper<
        CreateShopMutation,
        CreateShopMutationVariables
      >({
        source: CreateShopDocument,
        variableValues: {
          createShopInput: shopFaker,
          inputHoraireShop: inputHoraireShop
        },
        contextValue: token
      });
      expect(createShopResponse.data?.createShop?.name).toBe(shopFaker.name);
    });
    describe('shops query', () => {
      it('should return shops near artisan zipcode', async () => {
        shopFaker.zipCode = clientFaker.zipCode;
        shopFaker.siretNumber = '456758';
        await gqlHelper<CreateShopMutation, CreateShopMutationVariables>({
          source: CreateShopDocument,
          variableValues: {
            createShopInput: shopFaker,
            inputHoraireShop: inputHoraireShop
          },
          contextValue: token
        });
        const response = await gqlHelper<ShopsQuery>({
          source: ShopsDocument,
          contextValue: token
        });
        expect(response.data?.shops?.length).toBe(1);
        expect(response.data?.shops?.[0].zipCode).toBe(artisanFaker.zipCode);
      });
      it('should return shop near client zipcode', async () => {
        await createClient(clientFaker);
        const tokenClient = await singIn({
          email: clientFaker.email,
          password: clientFaker.password,
          role: Role.Client
        });
        const response = await gqlHelper<ShopsQuery>({
          source: ShopsDocument,
          contextValue: tokenClient.response.data?.signIn?.accessToken ?? ''
        });
        expect(response.data?.shops?.length).toBe(1);
        expect(response.data?.shops?.[0].zipCode).toBe(clientFaker.zipCode);
      });
      it('should return shop filtered by category or zipcodes', async () => {
        const responseFilteredZipCodeArtisan = await gqlHelper<
          ShopsQuery,
          ShopsQueryVariables
        >({
          source: ShopsDocument,
          variableValues: {
            shopsFiltersInput: {
              categoriesIds: null,
              zipcode: [zipCodeArtisan]
            }
          },
          contextValue: token
        });
        expect(responseFilteredZipCodeArtisan.data?.shops?.length).toBe(1);
        expect(responseFilteredZipCodeArtisan.data?.shops?.[0].zipCode).toBe(
          zipCodeArtisan
        );
        const responseFilteredZipCodeArtisanAndCategoriesId = await gqlHelper<
          ShopsQuery,
          ShopsQueryVariables
        >({
          source: ShopsDocument,
          variableValues: {
            shopsFiltersInput: {
              categoriesIds: [2],
              zipcode: [zipCodeArtisan]
            }
          },
          contextValue: token
        });
        expect(
          responseFilteredZipCodeArtisanAndCategoriesId.data?.shops?.length
        ).toBe(0);
        const responseFilteredZipCodeArtisanAndClient = await gqlHelper<
          ShopsQuery,
          ShopsQueryVariables
        >({
          source: ShopsDocument,
          variableValues: {
            shopsFiltersInput: {
              zipcode: [clientFaker.zipCode, artisanFaker.zipCode]
            }
          },
          contextValue: token
        });
        expect(
          responseFilteredZipCodeArtisanAndClient.data?.shops?.length
        ).toBe(2);
      });
    });
  });
});
