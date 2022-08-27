"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const user_resolver_1 = require("./user.resolver");
exports.default = (Container) => {
    return (0, type_graphql_1.buildSchema)({
        container: Container,
        resolvers: [user_resolver_1.UserResolver],
    });
};
//# sourceMappingURL=schema.js.map