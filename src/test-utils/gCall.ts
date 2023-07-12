import createSchema from '@src/graphql/schema';
import { graphql, GraphQLSchema } from 'graphql';

interface Options {
  source: string;
  variableValues?: any;
  userId?: number;
  typeResolver?: any;
}

let schema: GraphQLSchema;

export const gCall = async ({
  source,
  variableValues,
  userId,
  typeResolver
}: Options) => {
  if (!schema) {
    schema = await createSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
    typeResolver,
    contextValue: {
      req: {
        session: {
          userId
        }
      },
      res: {
        clearCookie: jest.fn()
      }
    }
  });
};
