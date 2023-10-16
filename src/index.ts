import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'module-alias/register';
import 'reflect-metadata';
import createSchema from './graphql/schema';

dotenv.config();

import { dataSource } from './app-data-source';
import { Container } from 'typedi';
import { DataSource } from 'typeorm';
import type { GraphQLFormattedError } from 'graphql';
import { ArgumentValidationError } from 'type-graphql';
import { unwrapResolverError } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';
import type { ValidationError as ClassValidatorValidationError } from 'class-validator';

type IValidationError = Pick<
  ClassValidatorValidationError,
  'property' | 'value' | 'constraints' | 'children'
>;

function formatValidationErrors(
  validationError: IValidationError
): IValidationError {
  return {
    property: validationError.property,
    ...(validationError.value && { value: validationError.value }),
    ...(validationError.constraints && {
      constraints: validationError.constraints
    }),
    ...(validationError.children &&
      validationError.children.length !== 0 && {
        children: validationError.children.map((child) =>
          formatValidationErrors(child)
        )
      })
  };
}

export class ValidationError extends GraphQLError {
  public constructor(validationErrors: ClassValidatorValidationError[]) {
    super('Validation Error', {
      extensions: {
        code: 'BAD_USER_INPUT',
        validationErrors: validationErrors.map((validationError) =>
          formatValidationErrors(validationError)
        )
      }
    });

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

function myFormatError(
  formattedError: GraphQLFormattedError,
  error: unknown
): GraphQLFormattedError {
  const originalError = unwrapResolverError(error);

  // Validation
  if (originalError instanceof ArgumentValidationError) {
    return new ValidationError(originalError.validationErrors);
  }

  // Generic
  return formattedError;
}
const bootstrap = async () => {
  await dataSource
    .initialize()
    .then(() => {
      // eslint-disable-next-line no-console -- Okay in this context
      console.log('Initializing data source....!');
    })
    .then(() => {
      Container.set(DataSource, dataSource);
    })
    .then(() => {
      // eslint-disable-next-line no-console -- Okay in this context
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console -- Okay in this context
      console.error('Error during Data Source initialization', err);
    });
  try {
    const schema = await createSchema();

    const app = express();
    const corsConfig = {
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      origin: [/localhost*/, 'https://studio.apollographql.com']
    };

    const port = 3000;
    // Create GraphQL server
    const server = new ApolloServer({
      schema,
      includeStacktraceInErrorResponses: true,
      introspection: true,
      apollo: {
        key: process.env.APOLLO_KEY,
        graphRef: process.env.APOLLO_GRAPH_REF
      }
    });
    await server.start();

    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({ req })
      }),
      cors(corsConfig)
    );
    app.listen({ port }, () => {
      // eslint-disable-next-line no-console
      console.log(
        `🚀🚀🚀🚀🚀 Server ready at http://localhost:${port}/graphql 🚀🚀🚀🚀🚀 `
      );
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('😡😡😡😡', err);
  }
};

bootstrap();
