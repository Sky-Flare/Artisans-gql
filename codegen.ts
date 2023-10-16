import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './schema.gql',
  generates: {
    'src/generated/graphql.ts': {
      documents: 'src/**/*.graphql',
      plugins: [
        'typescript',
        'typescript-resolvers',
        'typescript-graphql-request',
        'typescript-operations'
      ],
      config: { entireFieldWrapperValue: true }
    },
    './graphql.schema.json': {
      plugins: ['introspection']
    }
  }
};

export default config;
