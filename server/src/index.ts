import { PrismaClient } from "@prisma/client";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import logger from "./logger";
import { resolve } from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { refreshToken } from "./middleware/refreshToken";
import formDataRouter from "./routes/formData";
import rasdRouter from "./routes/gendoc";
import getRouter from "./routes/getSoldier";
import insertRouter from "./routes/insert";
import pingRouter from "./routes/ping";
import testRouter from "./routes/test";
import timeRouter from "./routes/time";

export interface Context {
  prisma: PrismaClient;
  user?: DecodedToken;
  isAuthenticated: boolean;
}

require("dotenv").config({ path: resolve(__dirname, "..", ".env") });

const main = async () => {
  const schema = await buildSchema({
    resolvers: [resolve(__dirname, "graphql", "resolvers", "*.resolver.ts")],
    validate: false,
  });

  const prisma = new PrismaClient({
    errorFormat: "pretty",
    log: ["query", "warn", "error"],
  });

  logger.info("connected to prisma client");

  const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
    context: ({ req }): Context => {
      let user: DecodedToken;
      let isAuthenticated = false;
      try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
          user = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
          isAuthenticated = true;
        }
      } catch (err) {
        if (err.message !== "invalid token") logger.error(err);
      } finally {
        return { prisma, user, isAuthenticated };
      }
    },
  });

  const app = express();

  app.use(
    cors({
      exposedHeaders: "filename",
    })
  );
  app.use(express.json());
  app.use(refreshToken);

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const PORT = process.env.PORT ?? 4000;

  app.use("/ping", pingRouter);
  app.use("/test", testRouter);
  app.use("/form-data", formDataRouter);
  app.use("/insert", insertRouter);
  app.use("/get", getRouter);
  app.use("/time", timeRouter);
  app.use("/rasd", rasdRouter);

  app.listen(PORT, () => {
    logger.info(`listening on port ${PORT}`);
  });
};

main();
