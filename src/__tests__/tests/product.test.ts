import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import { gqlHelper } from '@src/__tests__/helpers/gCall';
import {
  CreateCategoryProductDocument,
  CreateCategoryProductMutation,
  CreateCategoryProductMutationVariables,
  CreateCategoryShopDocument,
  CreateCategoryShopMutation,
  CreateCategoryShopMutationVariables,
  CreateProductDocument,
  CreateProductMutation,
  CreateProductMutationVariables,
  CreateShopDocument,
  CreateShopMutation,
  CreateShopMutationVariables,
  Days,
  DeleteProductDocument,
  DeleteProductMutation,
  DeleteProductMutationVariables,
  MutationCreateCategoryProductArgs,
  Role,
  ShopDocument,
  ShopQuery,
  ShopQueryVariables,
  ShopsDocument,
  ShopsQuery,
  ShopsQueryVariables
} from '../../generated/graphql';
import { initializeDataSource } from '@src/__tests__/config/dataSource';
import {
  createArtisan,
  createClient,
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
  await gqlHelper<
    CreateCategoryProductMutation,
    CreateCategoryProductMutationVariables
  >({
    source: CreateCategoryProductDocument,
    variableValues: {
      categoryProductInput: {
        name: 'Pains',
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
const zipCodeArtisan = Number(faker.location.zipCode());
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
const shopFaker = {
  address: faker.location.streetAddress(),
  shopCategoriesIds: [1],
  city: faker.location.city(),
  description: faker.lorem.sentence(10),
  name: faker.company.name(),
  siretNumber: '123123',
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
const productFaker = {
  categoriesProductsIds: [1],
  description: faker.lorem.sentence(10),
  name: faker.commerce.productName(),
  picture: faker.image.url(),
  price: Number(faker.commerce.price({ min: 1, max: 100 })),
  shopsIds: [1]
};
describe('Product', () => {
  describe('createProduct mutation', () => {
    it('should throw error Shop not found', async () => {
      productFaker.shopsIds = [2];
      const createProductResponse = await gqlHelper<
        CreateProductMutation,
        CreateProductMutationVariables
      >({
        source: CreateProductDocument,
        variableValues: {
          createProductInput: productFaker
        },
        contextValue: token
      });
      expect(createProductResponse.errors?.[0].message).toBe('Shop not found');
    });
    it('should throw error Categories product not found', async () => {
      productFaker.categoriesProductsIds = [2];
      productFaker.shopsIds = [1];
      const createProductResponse = await gqlHelper<
        CreateProductMutation,
        CreateProductMutationVariables
      >({
        source: CreateProductDocument,
        variableValues: {
          createProductInput: productFaker
        },
        contextValue: token
      });
      expect(createProductResponse.errors?.[0].message).toBe(
        'Categories product not found'
      );
    });
    it('should create product', async () => {
      productFaker.categoriesProductsIds = [1];
      const createProductResponse = await gqlHelper<
        CreateProductMutation,
        CreateProductMutationVariables
      >({
        source: CreateProductDocument,
        variableValues: {
          createProductInput: productFaker
        },
        contextValue: token
      });
      expect(createProductResponse.data?.createProduct?.name).toBe(
        productFaker.name
      );
      expect(
        createProductResponse.data?.createProduct?.categoriesProducts?.[0].name
      ).toBe('Pains');
      expect(createProductResponse.data?.createProduct?.shops?.[0].name).toBe(
        shopFaker.name
      );
    });
  });
  describe('deleteProduct mutation', () => {
    it('should return error Product not found', async () => {
      const deleteProductResponse = await gqlHelper<
        DeleteProductMutation,
        DeleteProductMutationVariables
      >({
        source: DeleteProductDocument,
        variableValues: {
          deleteProductId: 2
        },
        contextValue: token
      });
      expect(deleteProductResponse.errors?.[0].message).toBe(
        'Product not found'
      );
    });
    it('should delete product', async () => {
      const deleteProductResponse = await gqlHelper<
        DeleteProductMutation,
        DeleteProductMutationVariables
      >({
        source: DeleteProductDocument,
        variableValues: {
          deleteProductId: 1
        },
        contextValue: token
      });
      expect(deleteProductResponse.data?.deleteProduct).toBeTruthy();
    });
  });
});
