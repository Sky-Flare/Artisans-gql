import { buildSchema, ContainerType } from 'type-graphql';
import { authChecker } from './middlewares/auth';

export default (Container: ContainerType) => {
  return buildSchema({
    container: Container,
    resolvers: [__dirname + '/**/*.resolvers.{ts,js}'],
    authChecker
  });
};
