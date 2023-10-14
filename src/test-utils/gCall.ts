import createSchema from '@src/graphql/schema';
import { graphql } from 'graphql';
import type { ExecutionResult } from 'graphql/execution/execute';
import type { GraphQLArgs } from 'graphql/graphql';

const gqlHelper = async ({
  source,
  variableValues,
  contextValue
}: Pick<
  GraphQLArgs,
  'source' | 'variableValues' | 'contextValue'
>): Promise<ExecutionResult> =>
  graphql({
    schema: await createSchema(),
    source,
    variableValues,
    contextValue: {
      req: {
        headers: {
          authorization: contextValue
        }
      }
    }
  });
export { gqlHelper };
