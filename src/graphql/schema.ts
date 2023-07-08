import { buildSchema, ContainerType } from 'type-graphql';
import { Container } from 'typedi';
import { authChecker } from '@gqlMiddlewares/auth';

export default () => {
  return buildSchema({
    container: Container,
    resolvers: [__dirname + '/**/*.resolvers.{ts,js}'],
    authChecker
  });
};
