"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
exports.default = (Container) => {
    return (0, type_graphql_1.buildSchema)({
        container: Container,
        resolvers: [__dirname + '/**/*.resolver.{ts,js}'],
    });
};
//# sourceMappingURL=schema.js.map