import createSchema from '@src/graphql/schema';
import { graphql, GraphQLSchema } from 'graphql';

interface Options {
  source: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variableValues?: any;
  userId?: number;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues, userId }: Options) => {
  if (!schema) {
    schema = await createSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
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
