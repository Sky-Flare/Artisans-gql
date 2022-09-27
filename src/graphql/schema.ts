import { buildSchema } from 'type-graphql';
import { authChecker } from './middlewares/auth';

export default (Container: any) => {
  return buildSchema({
    container: Container,
    resolvers: [__dirname + '/**/*.resolver.{ts,js}'],
    authChecker,
  });
};
