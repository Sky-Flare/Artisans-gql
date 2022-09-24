import { buildSchema } from 'type-graphql';

export default (Container: any) => {
  return buildSchema({
    container: Container,
    resolvers: [__dirname + '/**/*.resolver.{ts,js}'],
  });
};
