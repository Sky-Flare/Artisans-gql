import { DataSource } from 'typeorm';
import { fakerFR as faker } from '@faker-js/faker';
import { gqlHelper } from '@src/__tests__/helpers/gCall';
import {
  ActionCart,
  CartDocument,
  CartQuery,
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
  Role,
  UpdateCartDocument,
  UpdateCartMutation,
  UpdateCartMutationVariables
} from '@src/generated/graphql';
import { initializeDataSource } from '@src/__tests__/config/dataSource';
import {
  createArtisan,
  createClient,
  signIn
} from '@src/__tests__/helpers/registrer';

let dataSource: DataSource;
let token = '';
let tokenClient = '';
beforeAll(async (): Promise<DataSource> => {
  dataSource = await initializeDataSource();
  await createArtisan(artisanFaker);
  await createClient(clientFaker);
  const { response } = await signIn({
    email: artisanFaker.email,
    password: artisanFaker.password,
    role: Role.Artisan
  });
  token = response.data?.signIn?.accessToken ?? '';

  const signInResponse = await signIn({
    email: clientFaker.email,
    password: clientFaker.password,
    role: Role.Client
  });
  tokenClient = signInResponse.response.data?.signIn?.accessToken ?? '';

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
  await gqlHelper<CreateProductMutation, CreateProductMutationVariables>({
    source: CreateProductDocument,
    variableValues: {
      createProductInput: productFaker
    },
    contextValue: token
  });
  return dataSource;
});
afterAll(async () => dataSource.destroy());

const clientFaker = {
  lastName: faker.person.lastName(),
  firstName: faker.person.firstName(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  zipCode: Number(faker.location.zipCode()),
  city: faker.location.city(),
  password: faker.internet.password()
};
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
  description: faker.lorem.text(),
  name: faker.commerce.productName(),
  picture: faker.image.url(),
  price: Number(faker.commerce.price({ min: 1, max: 100 })),
  shopsIds: [1]
};
describe('Cart', () => {
  describe('updateCart mutation', () => {
    it('should throw error Product not found', async () => {
      const updateCartResponse = await gqlHelper<
        UpdateCartMutation,
        UpdateCartMutationVariables
      >({
        source: UpdateCartDocument,
        variableValues: {
          updateCart: {
            action: ActionCart.Add,
            productId: 2,
            quantity: 1
          }
        },
        contextValue: tokenClient
      });
      expect(updateCartResponse.errors).toBeDefined();
      expect(updateCartResponse.errors?.[0].message).toEqual(
        'Product not found'
      );
    });
    it('should throw error Cart not found', async () => {
      const updateCartResponse = await gqlHelper<
        UpdateCartMutation,
        UpdateCartMutationVariables
      >({
        source: UpdateCartDocument,
        variableValues: {
          updateCart: {
            action: ActionCart.Remove,
            productId: 1,
            quantity: 1
          }
        },
        contextValue: tokenClient
      });
      expect(updateCartResponse.errors).toBeDefined();
      expect(updateCartResponse.errors?.[0].message).toBe('Cart not found');
    });
    it('should add product on cart', async () => {
      const updateCartResponse = await gqlHelper<
        UpdateCartMutation,
        UpdateCartMutationVariables
      >({
        source: UpdateCartDocument,
        variableValues: {
          updateCart: {
            action: ActionCart.Add,
            productId: 1,
            quantity: 1
          }
        },
        contextValue: tokenClient
      });
      expect(updateCartResponse.data?.updateCart?.quantity).toBe(1);
      expect(updateCartResponse.data?.updateCart?.product?.name).toBe(
        productFaker.name
      );
    });
    it('should remove product on cart', async () => {
      const updateCartAddResponse = await gqlHelper<
        UpdateCartMutation,
        UpdateCartMutationVariables
      >({
        source: UpdateCartDocument,
        variableValues: {
          updateCart: {
            action: ActionCart.Add,
            productId: 1,
            quantity: 1
          }
        },
        contextValue: tokenClient
      });
      expect(updateCartAddResponse.data?.updateCart?.quantity).toBe(2);
      const updateCartRemoveResponse = await gqlHelper<
        UpdateCartMutation,
        UpdateCartMutationVariables
      >({
        source: UpdateCartDocument,
        variableValues: {
          updateCart: {
            action: ActionCart.Remove,
            productId: 1,
            quantity: 1
          }
        },
        contextValue: tokenClient
      });
      expect(updateCartRemoveResponse.data?.updateCart?.quantity).toBe(1);
    });
    it('should remove cart for product', async () => {
      const updateCartRemoveResponse = await gqlHelper<
        UpdateCartMutation,
        UpdateCartMutationVariables
      >({
        source: UpdateCartDocument,
        variableValues: {
          updateCart: {
            action: ActionCart.Remove,
            productId: 1,
            quantity: 1
          }
        },
        contextValue: tokenClient
      });
      expect(updateCartRemoveResponse.data?.updateCart).toBeNull();
    });
  });
  describe('Cart query', () => {
    it('should return cart', async () => {
      const cartQueryResponse = await gqlHelper<CartQuery>({
        source: CartDocument,
        contextValue: tokenClient
      });
      expect(cartQueryResponse.data?.clientCart?.length).toBe(0);
      await gqlHelper<UpdateCartMutation, UpdateCartMutationVariables>({
        source: UpdateCartDocument,
        variableValues: {
          updateCart: {
            action: ActionCart.Add,
            productId: 1,
            quantity: 5
          }
        },
        contextValue: tokenClient
      });
      const cartQueryResponseTwo = await gqlHelper<CartQuery>({
        source: CartDocument,
        contextValue: tokenClient
      });
      const product = cartQueryResponseTwo.data?.clientCart?.find(
        (p) => p.productId === 1
      );
      expect(product).toBeDefined();
      expect(product?.quantity).toBe(5);
    });
  });
});
