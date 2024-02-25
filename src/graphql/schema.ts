import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { authChecker } from '@gqlMiddlewares/auth';
import { ArtisanResolvers } from '@resolver/artisan.resolvers';
import { CartResolvers } from '@resolver/cart.resolvers';
import { CategoryProductResolver } from '@resolver/category_product.resolvers';
import { CategoryShopResolver } from '@resolver/category_shop.resolvers';
import { ClientResolvers } from '@resolver/client.resolvers';
import { HorarairShopResolver } from '@resolver/horaire_shop.resolvers';
import { ProductResolvers } from '@resolver/product.resolvers';
import { RegistrerResolvers } from '@resolver/registrer.resolvers';
import { ShopResolvers } from '@resolver/shop.resolvers';

export default () => {
  return buildSchema({
    container: Container,
    emitSchemaFile: true,
    resolvers: [
      ArtisanResolvers,
      CartResolvers,
      CategoryProductResolver,
      CategoryShopResolver,
      ClientResolvers,
      HorarairShopResolver,
      ProductResolvers,
      RegistrerResolvers,
      ShopResolvers
    ],
    authChecker
  });
};
