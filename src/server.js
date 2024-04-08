import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { workOrdeTypeDefs } from './graphql/workorderSchema.js';
import { workOrderResolvers } from './graphql/workorderResolvers.js';
import { userTypeDefs } from './graphql/userServiceSchema.js';
import { userResolvers } from './graphql/userServiceResolvers.js';

const startServer = async () => {

  const app = express();
  const server = new ApolloServer({
    typeDefs: [workOrdeTypeDefs, userTypeDefs],
    resolvers: [workOrderResolvers, userResolvers], 
    context: ({ req }) => {
      // To find out the correct arguments for a specific integration,
      // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields
      // Get the user token from the headers.
      const token = req.headers.authorization || 'Lily';
      // Try to retrieve a user with the token
      //const user = getUser(token);
      return { user: token };
    },
  });
  // Make sure to start Apollo Server before applying middleware
  await server.start();
  server.applyMiddleware({ app });
  const PORT = process.env.PORT || 2009;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
