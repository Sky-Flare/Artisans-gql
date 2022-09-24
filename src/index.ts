import 'reflect-metadata';
import { Container } from 'typedi';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';

import createSchema from './graphql/schema';

import { AppDataSource } from './app-data-source';

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

const bootstrap = async () => {
  try {
    const schema = await createSchema(Container);

    const app = express();
    const corsConfig = {
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      origin: [/localhost*/, 'https://studio.apollographql.com'],
    };
    app.use(cors(corsConfig));

    const port = 3000;
    // Create GraphQL server
    const server = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
      debug: true,
      introspection: true,
    });
    await server.start();
    server.applyMiddleware({ app, cors: corsConfig });

    app.listen({ port }, () => {
      console.log(
        `🚀🚀🚀🚀🚀 Server ready at http://localhost:${port}${server.graphqlPath} 🚀🚀🚀🚀🚀 `
      );
    });
  } catch (err) {
    console.error(err);
  }
};

bootstrap();
