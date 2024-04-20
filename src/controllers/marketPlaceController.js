import { GraphQLClient, gql } from 'graphql-request';

class MarketPlaceController {
    constructor() {
        this.graphqlClient = new GraphQLClient(process.env.MARKETPLACE_SERVICE_URL);
        console.log("MarketPlace Service Client initialized with endpoint:", process.env.MARKETPLACE_SERVICE_URL);
    }

    async getAllGoods() {
        const query = gql`
      query {
        getAllGoods {
          id
          title
          description
          price
          image
          category
          tradePlace
          publishUser
          contact
          status
          createdAt
        }
      }
    `;
        const data = await this.graphqlClient.request(query);
        return data.getAllGoods;
    }

    async getGoodsByUser(publishUser) {
        const query = gql`
      query getGoodsByUser($publishUser: String!) {
        getGoodsByUser(publishUser: $publishUser) {
          id
          title
          description
          price
          image
          category
          tradePlace
          contact
          createdAt
        }
      }
    `;
        const variables = { publishUser: publishUser };
        const data = await this.graphqlClient.request(query, variables);
        return data.getGoodsByUser;
    }

    async getGoodsById(id) {
        const query = gql`
      query getGoodsById($id: ID!) {
        getGoodsById(id: $id) {
          id
          title
          description
          price
          image
          category
          tradePlace
          contact
          status
          createdAt
        }
      }
    `;
        const variables = { id };
        const data = await this.graphqlClient.request(query, variables);
        return data.getGoodsById;
    }

    async getOrdersByUser(userId) {
        const query = gql`
      query getOrdersByUser($userId: ID!) {
        getOrdersByUser(userId: $userId) {
          id
          goods {
                id
                title
                description
                price
                image
                category
                tradePlace
                publishUser
                contact
                status
                createdAt
          }
          buyer
          contact
        }
      }
    `;
        const variables = { userId };
        const data = await this.graphqlClient.request(query, variables);
        return data.getOrdersByUser;
    }

    async addGoods(title, description, price, image, category, tradePlace, contact, publishUser) {
        const mutation = gql`
      mutation addGoods($title: String!, $description: String!, $price: Float!, $image: String, $category: String!, $tradePlace: String!, $contact: String!, $publishUser: String!) {
        addGoods(title: $title, description: $description, price: $price, image: $image, category: $category, tradePlace: $tradePlace, contact: $contact, publishUser: $publishUser) {
          id
          title
        }
      }
    `;
        const variables = {
            title, description, price, image, category, tradePlace, contact, publishUser
        };
        const data = await this.graphqlClient.request(mutation, variables);
        return data.addGoods;
    }

    async updateGoods(id, title, description, price, image, category, tradePlace, contact, publishUser) {
        const mutation = gql`
      mutation updateGoods($id: ID! $title: String!, $description: String!, $price: Float!, $image: String, $category: String!, $tradePlace: String!, $contact: String!, $publishUser: String!) {
        updateGoods(id: $id, title: $title, description: $description, price: $price, image: $image, category: $category, tradePlace: $tradePlace, contact: $contact, publishUser: $publishUser) {
          id
          title
        }
      }
    `;
        const variables = {
            id, title, description, price, image, category, tradePlace, contact, publishUser
        };
        const data = await this.graphqlClient.request(mutation, variables);
        return data.addGoods;
    }

    async buyGoods(goodsId, userId, contact) {
        const mutation = gql`
      mutation buyGoods($goodsId: ID!, $userId: ID!, $contact: String!) {
        buyGoods(goodsId: $goodsId, userId: $userId, contact: $contact) {
          id
        }
      }
    `;
        const variables = { goodsId, userId, contact };
        const data = await this.graphqlClient.request(mutation, variables);
        return data.buyGoods;
    }

    async isGoodsOwner(goodsId, userId) {
        const query = gql`
      query isGoodsOwner($goodsId: ID!, $userId: ID!) {
        isGoodsOwner(goodsId: $goodsId, userId: $userId)
      }
    `;
        const variables = { goodsId, userId };
        const data = await this.graphqlClient.request(query, variables);
        return data.isGoodsOwner;

    }
}

export const marketPlaceController = new MarketPlaceController();
