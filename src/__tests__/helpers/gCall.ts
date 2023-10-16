import createSchema from '@src/graphql/schema';
import { DocumentNode, graphql } from 'graphql';
import type { ExecutionResult } from 'graphql/execution/execute';
import type { GraphQLArgs } from 'graphql/graphql';

const gqlHelper = async <TData>({
  source,
  variableValues,
  contextValue
}: Pick<GraphQLArgs, 'variableValues' | 'contextValue'> & {
  source: DocumentNode;
}): Promise<ExecutionResult<TData>> =>
  (await graphql({
    schema: await createSchema(),
    source: source.loc?.source.body ?? '',
    variableValues,
    contextValue: {
      req: {
        headers: {
          authorization: contextValue
        }
      }
    }
  })) as ExecutionResult<TData>;
export { gqlHelper };
