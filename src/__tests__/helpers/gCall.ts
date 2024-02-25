import createSchema from '@src/graphql/schema';
import { DocumentNode, graphql } from 'graphql';
import type { ExecutionResult } from 'graphql/execution/execute';
import type { GraphQLArgs } from 'graphql/graphql';
import { Maybe } from 'type-graphql';

const gqlHelper = async <
  TData,
  TVariables extends Maybe<
    { readonly [variable: string]: unknown } | undefined
  > = undefined
>({
  source,
  variableValues,
  contextValue
}: Pick<GraphQLArgs, 'contextValue'> & {
  source: DocumentNode;
  variableValues?: TVariables;
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
