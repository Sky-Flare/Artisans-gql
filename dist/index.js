"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typedi_1 = require("typedi");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const schema_1 = __importDefault(require("./graphql/schema"));
const app_data_source_1 = require("./app-data-source");
app_data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
})
    .catch((err) => {
    console.error('Error during Data Source initialization', err);
});
// register 3rd party IOC container
const bootstrap = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = yield (0, schema_1.default)(typedi_1.Container);
        const app = (0, express_1.default)();
        const corsConfig = {
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
            origin: [/localhost*/, 'https://studio.apollographql.com'],
        };
        app.use((0, cors_1.default)(corsConfig));
        const port = 3000;
        // Create GraphQL server
        const server = new apollo_server_express_1.ApolloServer({
            schema,
            context: ({ req, res }) => ({ req, res }),
            debug: true,
            introspection: true,
        });
        yield server.start();
        server.applyMiddleware({ app, cors: corsConfig });
        app.listen({ port }, () => {
            console.log(`🚀🚀🚀🚀🚀 Server ready at http://localhost:${port}${server.graphqlPath} 🚀🚀🚀🚀🚀 `);
        });
    }
    catch (err) {
        console.error(err);
    }
});
bootstrap();
//# sourceMappingURL=index.js.map