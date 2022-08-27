import { buildSchema } from 'type-graphql';
import { UserResolver } from './user.resolver';

export default (Container: any) => {
  return buildSchema({
    container: Container,
    resolvers: [UserResolver],
  });
};
