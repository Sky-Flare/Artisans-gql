import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'module-alias/register';
import 'reflect-metadata';
import { Container } from 'typedi';

import createSchema from '~/graphql/schema';

dotenv.config();

import { AppDataSource } from './app-data-source';

AppDataSource.initialize()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('💿💿💿💿💿 Data Source has been initialized ! 💿💿💿💿💿 ');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(
      '😡💿😡💿😡💿Error during Data Source initialization 💿😡💿😡💿😡',
      err
    );
  });

const bootstrap = async () => {
  try {
    const schema = await createSchema(Container);

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
