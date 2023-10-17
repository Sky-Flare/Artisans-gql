import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: { input: any; output: any; }
};

export enum ActionCart {
  Add = 'Add',
  Remove = 'Remove'
}

export type Artisan = {
  __typename?: 'Artisan';
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  lastName: Scalars['String']['output'];
  products?: Maybe<Array<Product>>;
  shops?: Maybe<Array<Shop>>;
  updatedAt: Scalars['DateTime']['output'];
  zipCode: Scalars['Float']['output'];
};

export type Cart = {
  __typename?: 'Cart';
  product?: Maybe<Product>;
  productId: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
};

/** New category product */
export type CategoryProductInput = {
  name: Scalars['String']['input'];
  picture?: InputMaybe<Scalars['String']['input']>;
  shopsIds?: InputMaybe<Array<Scalars['Float']['input']>>;
};

/** New category shop */
export type CategoryShopInput = {
  name: Scalars['String']['input'];
  picture?: InputMaybe<Scalars['String']['input']>;
};

export type Category_Product = {
  __typename?: 'Category_product';
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  picture?: Maybe<Scalars['String']['output']>;
  products?: Maybe<Array<Product>>;
  shops?: Maybe<Array<Shop>>;
};

export type Category_Shop = {
  __typename?: 'Category_shop';
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  picture?: Maybe<Scalars['String']['output']>;
};

export type Client = {
  __typename?: 'Client';
  address: Scalars['String']['output'];
  cart?: Maybe<Array<Cart>>;
  city: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  lastName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  zipCode: Scalars['Float']['output'];
};

export type ConnectUser = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: Role;
};

/** New artisan data */
export type CreateArtisanInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  sirenNumber: Scalars['String']['input'];
  zipCode: Scalars['Float']['input'];
};

/** New client data */
export type CreateClientInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  zipCode: Scalars['Float']['input'];
};

/** New product data */
export type CreateProductInput = {
  categoriesProductsIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  picture: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  shopsIds?: InputMaybe<Array<Scalars['Float']['input']>>;
};

/** New shop data */
export type CreateShopInput = {
  address: Scalars['String']['input'];
  categoriesIds: Array<Scalars['Float']['input']>;
  city: Scalars['String']['input'];
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  siretNumber: Scalars['String']['input'];
  zipCode: Scalars['Float']['input'];
};

export enum Days {
  Friday = 'Friday',
  Monday = 'Monday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
  Thursday = 'Thursday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday'
}

/** Get shops by categories id & zip code  */
export type GetShopCatIdsAndZipCode = {
  categoriesIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  /** if null use zipCode user */
  zipcode?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type Horaire_Shop = {
  __typename?: 'Horaire_shop';
  dayId: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  timeAmEnd?: Maybe<Scalars['String']['output']>;
  timeAmStart?: Maybe<Scalars['String']['output']>;
  timePmEnd?: Maybe<Scalars['String']['output']>;
  timePmStart?: Maybe<Scalars['String']['output']>;
};

export type InputHoraireShop = {
  dayId?: InputMaybe<Days>;
  timeAmEnd?: InputMaybe<Scalars['String']['input']>;
  timeAmStart?: InputMaybe<Scalars['String']['input']>;
  timePmEnd?: InputMaybe<Scalars['String']['input']>;
  timePmStart?: InputMaybe<Scalars['String']['input']>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategoryProduct: Category_Product;
  createCategoryShop: Category_Shop;
  createProduct?: Maybe<Product>;
  createShop?: Maybe<Shop>;
  deleteArtisan: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  signIn?: Maybe<LoginResponse>;
  signUpArtisan?: Maybe<LoginResponse>;
  signUpClient?: Maybe<LoginResponse>;
  updateArtisan: Artisan;
  updateCart?: Maybe<Cart>;
};


export type MutationCreateCategoryProductArgs = {
  categoryProductInput: CategoryProductInput;
};


export type MutationCreateCategoryShopArgs = {
  CategoryShopInput: CategoryShopInput;
};


export type MutationCreateProductArgs = {
  createProductInput: CreateProductInput;
};


export type MutationCreateShopArgs = {
  CreateShopInput: CreateShopInput;
  InputHoraireShop?: InputMaybe<Array<InputHoraireShop>>;
};


export type MutationDeleteProductArgs = {
  id: Scalars['Float']['input'];
};


export type MutationSignInArgs = {
  ConnectUser: ConnectUser;
};


export type MutationSignUpArtisanArgs = {
  CreateArtisanInput: CreateArtisanInput;
};


export type MutationSignUpClientArgs = {
  CreateClientInput: CreateClientInput;
};


export type MutationUpdateArtisanArgs = {
  CreateArtisanInput: CreateArtisanInput;
};


export type MutationUpdateCartArgs = {
  UpdateCart: UpdateCart;
};

export type Product = {
  __typename?: 'Product';
  categoriesProducts?: Maybe<Array<Category_Product>>;
  description: Scalars['String']['output'];
  enabled: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  picture: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  shops?: Maybe<Array<Shop>>;
};

export type Query = {
  __typename?: 'Query';
  /** Return on artisan */
  artisan?: Maybe<Artisan>;
  /** Return all artisans */
  artisans?: Maybe<Array<Artisan>>;
  categories_productByShop: Array<Category_Product>;
  categories_shop: Array<Category_Shop>;
  clientCart?: Maybe<Array<Cart>>;
  meArtisan?: Maybe<Artisan>;
  meClient?: Maybe<Client>;
  shop?: Maybe<Shop>;
  shops?: Maybe<Array<Shop>>;
};


export type QueryArtisanArgs = {
  artisanId: Scalars['Float']['input'];
};


export type QueryCategories_ProductByShopArgs = {
  shopId: Scalars['Float']['input'];
};


export type QueryShopArgs = {
  shopId: Scalars['Float']['input'];
};


export type QueryShopsArgs = {
  filtersInput?: InputMaybe<GetShopCatIdsAndZipCode>;
};

export enum Role {
  Admin = 'ADMIN',
  Artisan = 'ARTISAN',
  Client = 'CLIENT',
  Owner = 'OWNER'
}

export type Shop = {
  __typename?: 'Shop';
  address: Scalars['String']['output'];
  artisan: Artisan;
  categoriesProducts?: Maybe<Array<Category_Product>>;
  categoriesShops: Array<Category_Shop>;
  city: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  enabled: Scalars['Float']['output'];
  horaireShop?: Maybe<Array<Horaire_Shop>>;
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  products?: Maybe<Array<Product>>;
  updatedAt: Scalars['DateTime']['output'];
  zipCode: Scalars['Float']['output'];
};

/** Cart client */
export type UpdateCart = {
  action: ActionCart;
  productId: Scalars['Float']['input'];
  quantity: Scalars['Float']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  lastName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ActionCart: ActionCart;
  Artisan: ResolverTypeWrapper<Artisan>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Cart: ResolverTypeWrapper<Cart>;
  CategoryProductInput: CategoryProductInput;
  CategoryShopInput: CategoryShopInput;
  Category_product: ResolverTypeWrapper<Category_Product>;
  Category_shop: ResolverTypeWrapper<Category_Shop>;
  Client: ResolverTypeWrapper<Client>;
  ConnectUser: ConnectUser;
  CreateArtisanInput: CreateArtisanInput;
  CreateClientInput: CreateClientInput;
  CreateProductInput: CreateProductInput;
  CreateShopInput: CreateShopInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Days: Days;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GetShopCatIdsAndZipCode: GetShopCatIdsAndZipCode;
  Horaire_shop: ResolverTypeWrapper<Horaire_Shop>;
  InputHoraireShop: InputHoraireShop;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Product: ResolverTypeWrapper<Product>;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  Shop: ResolverTypeWrapper<Shop>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateCart: UpdateCart;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Artisan: Artisan;
  Boolean: Scalars['Boolean']['output'];
  Cart: Cart;
  CategoryProductInput: CategoryProductInput;
  CategoryShopInput: CategoryShopInput;
  Category_product: Category_Product;
  Category_shop: Category_Shop;
  Client: Client;
  ConnectUser: ConnectUser;
  CreateArtisanInput: CreateArtisanInput;
  CreateClientInput: CreateClientInput;
  CreateProductInput: CreateProductInput;
  CreateShopInput: CreateShopInput;
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  GetShopCatIdsAndZipCode: GetShopCatIdsAndZipCode;
  Horaire_shop: Horaire_Shop;
  InputHoraireShop: InputHoraireShop;
  LoginResponse: LoginResponse;
  Mutation: {};
  Product: Product;
  Query: {};
  Shop: Shop;
  String: Scalars['String']['output'];
  UpdateCart: UpdateCart;
  User: User;
};

export type ArtisanResolvers<ContextType = any, ParentType extends ResolversParentTypes['Artisan'] = ResolversParentTypes['Artisan']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  products?: Resolver<Maybe<Array<ResolversTypes['Product']>>, ParentType, ContextType>;
  shops?: Resolver<Maybe<Array<ResolversTypes['Shop']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  zipCode?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CartResolvers<ContextType = any, ParentType extends ResolversParentTypes['Cart'] = ResolversParentTypes['Cart']> = {
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Category_ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category_product'] = ResolversParentTypes['Category_product']> = {
  id?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  products?: Resolver<Maybe<Array<ResolversTypes['Product']>>, ParentType, ContextType>;
  shops?: Resolver<Maybe<Array<ResolversTypes['Shop']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Category_ShopResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category_shop'] = ResolversParentTypes['Category_shop']> = {
  id?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cart?: Resolver<Maybe<Array<ResolversTypes['Cart']>>, ParentType, ContextType>;
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  zipCode?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type Horaire_ShopResolvers<ContextType = any, ParentType extends ResolversParentTypes['Horaire_shop'] = ResolversParentTypes['Horaire_shop']> = {
  dayId?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  timeAmEnd?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timeAmStart?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timePmEnd?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timePmStart?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createCategoryProduct?: Resolver<ResolversTypes['Category_product'], ParentType, ContextType, RequireFields<MutationCreateCategoryProductArgs, 'categoryProductInput'>>;
  createCategoryShop?: Resolver<ResolversTypes['Category_shop'], ParentType, ContextType, RequireFields<MutationCreateCategoryShopArgs, 'CategoryShopInput'>>;
  createProduct?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'createProductInput'>>;
  createShop?: Resolver<Maybe<ResolversTypes['Shop']>, ParentType, ContextType, RequireFields<MutationCreateShopArgs, 'CreateShopInput'>>;
  deleteArtisan?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  deleteProduct?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'id'>>;
  signIn?: Resolver<Maybe<ResolversTypes['LoginResponse']>, ParentType, ContextType, RequireFields<MutationSignInArgs, 'ConnectUser'>>;
  signUpArtisan?: Resolver<Maybe<ResolversTypes['LoginResponse']>, ParentType, ContextType, RequireFields<MutationSignUpArtisanArgs, 'CreateArtisanInput'>>;
  signUpClient?: Resolver<Maybe<ResolversTypes['LoginResponse']>, ParentType, ContextType, RequireFields<MutationSignUpClientArgs, 'CreateClientInput'>>;
  updateArtisan?: Resolver<ResolversTypes['Artisan'], ParentType, ContextType, RequireFields<MutationUpdateArtisanArgs, 'CreateArtisanInput'>>;
  updateCart?: Resolver<Maybe<ResolversTypes['Cart']>, ParentType, ContextType, RequireFields<MutationUpdateCartArgs, 'UpdateCart'>>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  categoriesProducts?: Resolver<Maybe<Array<ResolversTypes['Category_product']>>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  picture?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  shops?: Resolver<Maybe<Array<ResolversTypes['Shop']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  artisan?: Resolver<Maybe<ResolversTypes['Artisan']>, ParentType, ContextType, RequireFields<QueryArtisanArgs, 'artisanId'>>;
  artisans?: Resolver<Maybe<Array<ResolversTypes['Artisan']>>, ParentType, ContextType>;
  categories_productByShop?: Resolver<Array<ResolversTypes['Category_product']>, ParentType, ContextType, RequireFields<QueryCategories_ProductByShopArgs, 'shopId'>>;
  categories_shop?: Resolver<Array<ResolversTypes['Category_shop']>, ParentType, ContextType>;
  clientCart?: Resolver<Maybe<Array<ResolversTypes['Cart']>>, ParentType, ContextType>;
  meArtisan?: Resolver<Maybe<ResolversTypes['Artisan']>, ParentType, ContextType>;
  meClient?: Resolver<Maybe<ResolversTypes['Client']>, ParentType, ContextType>;
  shop?: Resolver<Maybe<ResolversTypes['Shop']>, ParentType, ContextType, RequireFields<QueryShopArgs, 'shopId'>>;
  shops?: Resolver<Maybe<Array<ResolversTypes['Shop']>>, ParentType, ContextType, Partial<QueryShopsArgs>>;
};

export type ShopResolvers<ContextType = any, ParentType extends ResolversParentTypes['Shop'] = ResolversParentTypes['Shop']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  artisan?: Resolver<ResolversTypes['Artisan'], ParentType, ContextType>;
  categoriesProducts?: Resolver<Maybe<Array<ResolversTypes['Category_product']>>, ParentType, ContextType>;
  categoriesShops?: Resolver<Array<ResolversTypes['Category_shop']>, ParentType, ContextType>;
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  horaireShop?: Resolver<Maybe<Array<ResolversTypes['Horaire_shop']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  products?: Resolver<Maybe<Array<ResolversTypes['Product']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  zipCode?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Artisan?: ArtisanResolvers<ContextType>;
  Cart?: CartResolvers<ContextType>;
  Category_product?: Category_ProductResolvers<ContextType>;
  Category_shop?: Category_ShopResolvers<ContextType>;
  Client?: ClientResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Horaire_shop?: Horaire_ShopResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Shop?: ShopResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};



export const MeArtisanDocument = gql`
    query MeArtisan {
  meArtisan {
    address
    city
    createdAt
    email
    firstName
    id
    lastName
    updatedAt
    zipCode
  }
}
    `;
export const ArtisanDocument = gql`
    query Artisan($artisanId: Float!) {
  artisan(artisanId: $artisanId) {
    lastName
  }
}
    `;
export const ArtisansDocument = gql`
    query Artisans {
  artisans {
    firstName
  }
}
    `;
export const UpdateArtisanDocument = gql`
    mutation UpdateArtisan($createArtisanInput: CreateArtisanInput!) {
  updateArtisan(CreateArtisanInput: $createArtisanInput) {
    lastName
  }
}
    `;
export const DeleteArtisanDocument = gql`
    mutation DeleteArtisan {
  deleteArtisan
}
    `;
export const UpdateCartDocument = gql`
    mutation UpdateCart($updateCart: UpdateCart!) {
  updateCart(UpdateCart: $updateCart) {
    quantity
    productId
    product {
      name
    }
  }
}
    `;
export const CartDocument = gql`
    query Cart {
  clientCart {
    product {
      name
      price
      shops {
        name
      }
    }
    productId
    quantity
  }
}
    `;
export const CreateCategoryProductDocument = gql`
    mutation CreateCategoryProduct($categoryProductInput: CategoryProductInput!) {
  createCategoryProduct(categoryProductInput: $categoryProductInput) {
    picture
    name
  }
}
    `;
export const Categories_ProductByShopDocument = gql`
    query Categories_productByShop($shopId: Float!) {
  categories_productByShop(shopId: $shopId) {
    name
  }
}
    `;
export const CreateCategoryShopDocument = gql`
    mutation CreateCategoryShop($categoryShopInput: CategoryShopInput!) {
  createCategoryShop(CategoryShopInput: $categoryShopInput) {
    name
    picture
  }
}
    `;
export const CategoriesShopDocument = gql`
    query CategoriesShop {
  categories_shop {
    name
    picture
  }
}
    `;
export const MeClientDocument = gql`
    query MeClient {
  meClient {
    email
  }
}
    `;
export const CreateProductDocument = gql`
    mutation CreateProduct($createProductInput: CreateProductInput!) {
  createProduct(createProductInput: $createProductInput) {
    id
    name
    enabled
    description
    categoriesProducts {
      name
      picture
    }
    picture
    price
    shops {
      name
    }
  }
}
    `;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($deleteProductId: Float!) {
  deleteProduct(id: $deleteProductId)
}
    `;
export const SignUpArtisanDocument = gql`
    mutation SignUpArtisan($createArtisanInput: CreateArtisanInput!) {
  signUpArtisan(CreateArtisanInput: $createArtisanInput) {
    accessToken
  }
}
    `;
export const SignUpClientDocument = gql`
    mutation SignUpClient($createClientInput: CreateClientInput!) {
  signUpClient(CreateClientInput: $createClientInput) {
    accessToken
  }
}
    `;
export const SignInDocument = gql`
    mutation SignIn($connectUser: ConnectUser!) {
  signIn(ConnectUser: $connectUser) {
    accessToken
  }
}
    `;
export const ShopsDocument = gql`
    query Shops($shopsFiltersInput: GetShopCatIdsAndZipCode) {
  shops(filtersInput: $shopsFiltersInput) {
    name
    zipCode
  }
}
    `;
export const ShopDocument = gql`
    query Shop($shopId: Float!) {
  shop(shopId: $shopId) {
    name
  }
}
    `;
export const CreateShopDocument = gql`
    mutation CreateShop($createShopInput: CreateShopInput!, $inputHoraireShop: [InputHoraireShop!]) {
  createShop(
    CreateShopInput: $createShopInput
    InputHoraireShop: $inputHoraireShop
  ) {
    name
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    MeArtisan(variables?: MeArtisanQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<MeArtisanQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeArtisanQuery>(MeArtisanDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MeArtisan', 'query');
    },
    Artisan(variables: ArtisanQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ArtisanQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ArtisanQuery>(ArtisanDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Artisan', 'query');
    },
    Artisans(variables?: ArtisansQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ArtisansQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ArtisansQuery>(ArtisansDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Artisans', 'query');
    },
    UpdateArtisan(variables: UpdateArtisanMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateArtisanMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateArtisanMutation>(UpdateArtisanDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateArtisan', 'mutation');
    },
    DeleteArtisan(variables?: DeleteArtisanMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteArtisanMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteArtisanMutation>(DeleteArtisanDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteArtisan', 'mutation');
    },
    UpdateCart(variables: UpdateCartMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateCartMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateCartMutation>(UpdateCartDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateCart', 'mutation');
    },
    Cart(variables?: CartQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CartQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CartQuery>(CartDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Cart', 'query');
    },
    CreateCategoryProduct(variables: CreateCategoryProductMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateCategoryProductMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCategoryProductMutation>(CreateCategoryProductDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateCategoryProduct', 'mutation');
    },
    Categories_productByShop(variables: Categories_ProductByShopQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<Categories_ProductByShopQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Categories_ProductByShopQuery>(Categories_ProductByShopDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Categories_productByShop', 'query');
    },
    CreateCategoryShop(variables: CreateCategoryShopMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateCategoryShopMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCategoryShopMutation>(CreateCategoryShopDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateCategoryShop', 'mutation');
    },
    CategoriesShop(variables?: CategoriesShopQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CategoriesShopQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CategoriesShopQuery>(CategoriesShopDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CategoriesShop', 'query');
    },
    MeClient(variables?: MeClientQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<MeClientQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeClientQuery>(MeClientDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MeClient', 'query');
    },
    CreateProduct(variables: CreateProductMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateProductMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateProductMutation>(CreateProductDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateProduct', 'mutation');
    },
    DeleteProduct(variables: DeleteProductMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteProductMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteProductMutation>(DeleteProductDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteProduct', 'mutation');
    },
    SignUpArtisan(variables: SignUpArtisanMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SignUpArtisanMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignUpArtisanMutation>(SignUpArtisanDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SignUpArtisan', 'mutation');
    },
    SignUpClient(variables: SignUpClientMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SignUpClientMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignUpClientMutation>(SignUpClientDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SignUpClient', 'mutation');
    },
    SignIn(variables: SignInMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SignInMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignInMutation>(SignInDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SignIn', 'mutation');
    },
    Shops(variables?: ShopsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ShopsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ShopsQuery>(ShopsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Shops', 'query');
    },
    Shop(variables: ShopQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ShopQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ShopQuery>(ShopDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Shop', 'query');
    },
    CreateShop(variables: CreateShopMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateShopMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateShopMutation>(CreateShopDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateShop', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export type MeArtisanQueryVariables = Exact<{ [key: string]: never; }>;


export type MeArtisanQuery = { __typename?: 'Query', meArtisan?: { __typename?: 'Artisan', address: string, city: string, createdAt: any, email: string, firstName: string, id: number, lastName: string, updatedAt: any, zipCode: number } | null };

export type ArtisanQueryVariables = Exact<{
  artisanId: Scalars['Float']['input'];
}>;


export type ArtisanQuery = { __typename?: 'Query', artisan?: { __typename?: 'Artisan', lastName: string } | null };

export type ArtisansQueryVariables = Exact<{ [key: string]: never; }>;


export type ArtisansQuery = { __typename?: 'Query', artisans?: Array<{ __typename?: 'Artisan', firstName: string }> | null };

export type UpdateArtisanMutationVariables = Exact<{
  createArtisanInput: CreateArtisanInput;
}>;


export type UpdateArtisanMutation = { __typename?: 'Mutation', updateArtisan: { __typename?: 'Artisan', lastName: string } };

export type DeleteArtisanMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteArtisanMutation = { __typename?: 'Mutation', deleteArtisan: boolean };

export type UpdateCartMutationVariables = Exact<{
  updateCart: UpdateCart;
}>;


export type UpdateCartMutation = { __typename?: 'Mutation', updateCart?: { __typename?: 'Cart', quantity: number, productId: number, product?: { __typename?: 'Product', name: string } | null } | null };

export type CartQueryVariables = Exact<{ [key: string]: never; }>;


export type CartQuery = { __typename?: 'Query', clientCart?: Array<{ __typename?: 'Cart', productId: number, quantity: number, product?: { __typename?: 'Product', name: string, price: number, shops?: Array<{ __typename?: 'Shop', name: string }> | null } | null }> | null };

export type CreateCategoryProductMutationVariables = Exact<{
  categoryProductInput: CategoryProductInput;
}>;


export type CreateCategoryProductMutation = { __typename?: 'Mutation', createCategoryProduct: { __typename?: 'Category_product', picture?: string | null, name: string } };

export type Categories_ProductByShopQueryVariables = Exact<{
  shopId: Scalars['Float']['input'];
}>;


export type Categories_ProductByShopQuery = { __typename?: 'Query', categories_productByShop: Array<{ __typename?: 'Category_product', name: string }> };

export type CreateCategoryShopMutationVariables = Exact<{
  categoryShopInput: CategoryShopInput;
}>;


export type CreateCategoryShopMutation = { __typename?: 'Mutation', createCategoryShop: { __typename?: 'Category_shop', name: string, picture?: string | null } };

export type CategoriesShopQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesShopQuery = { __typename?: 'Query', categories_shop: Array<{ __typename?: 'Category_shop', name: string, picture?: string | null }> };

export type MeClientQueryVariables = Exact<{ [key: string]: never; }>;


export type MeClientQuery = { __typename?: 'Query', meClient?: { __typename?: 'Client', email: string } | null };

export type CreateProductMutationVariables = Exact<{
  createProductInput: CreateProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct?: { __typename?: 'Product', id: number, name: string, enabled: number, description: string, picture: string, price: number, categoriesProducts?: Array<{ __typename?: 'Category_product', name: string, picture?: string | null }> | null, shops?: Array<{ __typename?: 'Shop', name: string }> | null } | null };

export type DeleteProductMutationVariables = Exact<{
  deleteProductId: Scalars['Float']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: boolean };

export type SignUpArtisanMutationVariables = Exact<{
  createArtisanInput: CreateArtisanInput;
}>;


export type SignUpArtisanMutation = { __typename?: 'Mutation', signUpArtisan?: { __typename?: 'LoginResponse', accessToken: string } | null };

export type SignUpClientMutationVariables = Exact<{
  createClientInput: CreateClientInput;
}>;


export type SignUpClientMutation = { __typename?: 'Mutation', signUpClient?: { __typename?: 'LoginResponse', accessToken: string } | null };

export type SignInMutationVariables = Exact<{
  connectUser: ConnectUser;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn?: { __typename?: 'LoginResponse', accessToken: string } | null };

export type ShopsQueryVariables = Exact<{
  shopsFiltersInput?: InputMaybe<GetShopCatIdsAndZipCode>;
}>;


export type ShopsQuery = { __typename?: 'Query', shops?: Array<{ __typename?: 'Shop', name: string, zipCode: number }> | null };

export type ShopQueryVariables = Exact<{
  shopId: Scalars['Float']['input'];
}>;


export type ShopQuery = { __typename?: 'Query', shop?: { __typename?: 'Shop', name: string } | null };

export type CreateShopMutationVariables = Exact<{
  createShopInput: CreateShopInput;
  inputHoraireShop?: InputMaybe<Array<InputHoraireShop> | InputHoraireShop>;
}>;


export type CreateShopMutation = { __typename?: 'Mutation', createShop?: { __typename?: 'Shop', name: string } | null };
