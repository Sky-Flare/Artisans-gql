import { buildSchema, ContainerType } from "type-graphql";
import { authChecker } from "./middlewares/auth";

export default (Container: any) => {
  return buildSchema({
    container: Container,
    resolvers: [__dirname + "/**/*.resolvers.{ts,js}"],
    authChecker
  });
};
