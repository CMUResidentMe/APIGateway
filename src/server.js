import express from 'express';
import { config } from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/userServiceSchema.js';
import { resolvers } from './graphql/userServiceResolvers.js';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`);
    console.log(`GraphQL ready at http://localhost:${port}${apolloServer.graphqlPath}`);
  });
}

startServer();


