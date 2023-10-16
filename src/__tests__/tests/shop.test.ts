import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import { gqlHelper } from '@src/__tests__/helpers/gCall';
import {
  CreateCategoryShopDocument,
  CreateShopDocument,
  CreateShopMutation,
  Days,
  ShopsDocument,
  ShopsQuery
} from '../../generated/graphql';
import { Role } from '@entity/generic/user';
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
    role: Role.ARTISAN
  });
  token = response.data?.signIn?.accessToken ?? '';
  await gqlHelper<CreateShopMutation>({
    source: CreateCategoryShopDocument,
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
    it('Should throw error siren require', async () => {
      const createShopResponse = await gqlHelper<CreateShopMutation>({
        source: CreateShopDocument,
        variableValues: {
          createShopInput: shopFaker
        },
        contextValue: token
      });
      expect(createShopResponse.errors?.[0].message).toContain('Siren requier');
    });
    it('Should throw error Category required', async () => {
      shopFaker.categoriesIds = [];
      shopFaker.siretNumber = '56789';
      const createShopResponse = await gqlHelper<CreateShopMutation>({
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
      shopFaker.categoriesIds = [2];
      const createShopResponse = await gqlHelper<CreateShopMutation>({
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

      const createShopResponse = await gqlHelper<CreateShopMutation>({
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
        const shopResponse = await gqlHelper<CreateShopMutation>({
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
          role: Role.CLIENT
        });
        const response = await gqlHelper<ShopsQuery>({
          source: ShopsDocument,
          contextValue: tokenClient.response.data?.signIn?.accessToken ?? ''
        });
        expect(response.data?.shops?.length).toBe(1);
        expect(response.data?.shops?.[0].zipCode).toBe(clientFaker.zipCode);
      });
    });
  });
});
