import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import * as morgan from "morgan";
import cors from "cors";
import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';
import { workOrderTypeDefs } from './graphql/workorder/workorderSchema.js';
import { workOrderResolvers } from './graphql/workorder/workorderResolvers.js';
import { userTypeDefs } from './graphql/userServiceSchema.js';
import { userResolvers } from './graphql/userServiceResolvers.js';
import { getMulter } from './controllers/workorder/workOrderFileUpload.js';

const startServer = async () => {

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan.default("dev"));
  app.use(express.static("uploads"));


  // app.use((req, res, next) => {
  //   console.log(req.headers);
  //   console.log(req.body);
  //   next();
  // });


  app.post("/workorder/upload", getMulter().single('file'), (req, res) => {
    let fileURL = req.file.path;
    res.status(201).json({ fileURL });
  });

  const server = new ApolloServer({
    typeDefs: [workOrderTypeDefs, userTypeDefs],
    resolvers: [workOrderResolvers, userResolvers], 
    context: ({ req }) => {
      // To find out the correct arguments for a specific integration,
      // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields
      // Get the user token from the headers.
      //console.log(req.body.operationName);
      if(req.body.operationName !== 'Register' && 
        req.body.operationName !== 'register' && 
        req.body.operationName !== 'Login' && 
        req.body.operationName !== 'login'
      ){
        try{
          const token = req.headers.authorization;
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          return { user: decoded.id};
        }catch(err){
          console.error("Error: error token ", err);
        }
      }
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
