import { Role } from '@entity/generic/user';
import createSchema from '@src/graphql/schema';
import { graphql, GraphQLSchema } from 'graphql';
//
// interface Options {
//   source: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   variableValues?: any;
//   payload?: {
//     userId: number;
//     role: Role;
//   };
//   token?: string;
// }
//
// let schema: GraphQLSchema;
//
// export const gCall = async ({ source, variableValues, payload, token }: Options) => {
//   if (!schema) {
//     schema = await createSchema();
//   }
//   return graphql({
//     schema,
//     source,
//     variableValues,
//     contextValue: {
//       payload: payload,
//       req: {
//         headers: {
//           authorization: token
//         },
//         clearCookie: jest.fn()
//       }
//     }
//   });
// };
import type { ExecutionResult } from 'graphql/execution/execute';
import type { GraphQLArgs } from 'graphql/graphql';

const gqlHelper = async ({
  source,
  variableValues
}: Pick<GraphQLArgs, 'source' | 'variableValues'>): Promise<ExecutionResult> =>
  graphql({
    schema: await createSchema(),
    source,
    variableValues
  });
export { gqlHelper };
