import { gql } from "apollo-server-express";

export const marketPlaceTypeDefs = gql`
  type SecondHandGoods {
    id: ID!
    title: String!
    description: String!
    price: Float!
    image: String
    category: String!
    tradePlace: String!
    publishUser: String!
    contact: String!
    status: String!
    createdAt: String!
  }
  
  type SecondHandGoodsOrder {
    id: ID!
    goods: SecondHandGoods!
    buyer: String!
    contact: String!
  }

  type Query {
    getAllGoods: [SecondHandGoods]
    getGoodsByUser: [SecondHandGoods]
    getGoodsById(id: ID!): SecondHandGoods
    getOrdersByUser: [SecondHandGoodsOrder]
    isGoodsOwner(goodsId: ID!): Boolean
  }

  type Mutation {
    addGoods(title: String!, description: String!, price: Float!, image: String, category: String!, tradePlace: String!, contact: String!): SecondHandGoods
    updateGoods(id: ID!, title: String, description: String, price: Float, image: String, category: String, tradePlace: String, contact: String): SecondHandGoods
    deleteGoods(id: ID!, userId: String!): String
    buyGoods(goodsId: ID!, contact: String!): SecondHandGoodsOrder
  }
`;