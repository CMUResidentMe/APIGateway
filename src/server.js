import dotenv from "dotenv";
dotenv.config();

import express from "express";
import * as morgan from "morgan";
import cors from "cors";
import jwt from "jsonwebtoken";
import { ApolloServer } from "apollo-server-express";
import { workOrderTypeDefs } from "./graphql/workorder/workorderSchema.js";
import { workOrderResolvers } from "./graphql/workorder/workorderResolvers.js";
import { commBoardTypeDefs } from "./graphql/commBoard/commBoardSchema.js";
import { commBoardResolvers } from "./graphql/commBoard/commBoardResolvers.js";
import { marketPlaceTypeDefs } from "./graphql/marketPlace/marketPlaceSchema.js";
import { marketPlaceResolvers } from "./graphql/marketPlace/marketPlaceResolvers.js";
import { userTypeDefs } from "./graphql/userServiceSchema.js";
import { userResolvers } from "./graphql/userServiceResolvers.js";
import { getMulter } from "./controllers/workorder/workOrderFileUpload.js";
import { roomBookingTypeDefs } from "./graphql/roomBook/roomBookingTypeDefs.js";
import { roomBookingResolvers } from "./graphql/roomBook/roomBookResolvers.js";

const startServer = async () => {
  const app = express();
  app.use(cors());
  app.use(
    express.json({
      limit: "50mb",
    })
  );
  app.use(morgan.default("dev"));
  app.use(express.static("uploads"));

  // app.use((req, res, next) => {
  //   console.log("req.headers: " + req.headers);
  //   console.log(req.body);
  //   next();
  // });

  app.post("/workorder/upload", getMulter().single("file"), (req, res) => {
    let fileURL = req.file.path;
    res.status(201).json({ fileURL });
  });

  const server = new ApolloServer({
    typeDefs: [
      workOrderTypeDefs,
      userTypeDefs,
      commBoardTypeDefs,
      roomBookingTypeDefs,
      marketPlaceTypeDefs,
    ],
    resolvers: [
      workOrderResolvers,
      userResolvers,
      commBoardResolvers,
      roomBookingResolvers,
      marketPlaceResolvers,
    ],
    context: ({ req }) => {
      // To find out the correct arguments for a specific integration,
      // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields
      // Get the user token from the headers.
      //console.log(req.body.operationName);
      const nonAuthOperations = ["Register", "register", "Login", "login"];
      if (!nonAuthOperations.includes(req.body.operationName)) {
        const token = req.headers.authorization || "";

        if (!token) {
          console.log("No token found");
          throw new AuthenticationError(
            "Authorization header must be provided"
          );
        }

        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          return { user: decoded.id }; // Assuming 'id' is encoded in JWT
        } catch (err) {
          console.log("Error in token verification: ", err);
          throw new AuthenticationError("Invalid or expired token");
        }
      }
    },
  });
  // Make sure to start Apollo Server before applying middleware
  await server.start();
  server.applyMiddleware({ app });
  const PORT = process.env.PORT || 2009;
  app.listen(PORT);
};

startServer();
