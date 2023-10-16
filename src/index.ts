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
