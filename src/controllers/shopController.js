import { GraphQLClient, gql } from 'graphql-request';

class ShopController {
  constructor() {
    this.graphqlClient = new GraphQLClient(process.env.MARKETPLACE_SERVICE_URL);
    console.log("MarketPlace Service Client initialized with endpoint:", process.env.MARKETPLACE_SERVICE_URL);
  }


  async getCategories() {
    const query = gql`
      {
        categories {
          _id
          name
        }
      }
    `;
    const data = await this.graphqlClient.request(query);
    return data.categories;
  }

  async getListedProductsByCategory(categoryId) {
    const query = gql`
      query GetListedProductsByCategory($category: ID) {
        getListedProductsByCategory(category: $category) {
          _id
          name
          purchasePlace
          category {
            name
            _id
          }
          description
        }
      }
    `;
    const variables = { category: categoryId };
    const data = await this.graphqlClient.request(query, variables);
    return data.getListedProductsByCategory;
  }

  async getBMSCategoryIdByName(name) {
    const query = gql`
      query getBMSCategoryIdByName($name: String) {
        getBMSCategoryIdByName(name: $name) {
          _id
          name
        }
      }
    `;
    const variables = { name };
    const data = await this.graphqlClient.request(query, variables);
    return data.getBMSCategoryIdByName;
  }

  async getAllListingCategories() {
    const query = gql`
      query GetAllListingCategories {
        getAllListingCategories {
          name
          image
          _id
        }
      }
    `;
    const data = await this.graphqlClient.request(query);
    return data.getAllListingCategories;
  }

  async getAllListedProducts() {
    const query = gql`
      query GetAllListedProducts {
        getAllListedProducts {
          _id
          purchasePlace
          image
          listingDate
          name
        }
      }
    `;
    const data = await this.graphqlClient.request(query);
    return data.getAllListedProducts;
  }

  async getListedProductsByUser(userId) {
    const query = gql`
      query GetListedProductsByUser($user: ID!) {
        getListedProductsByUser(user: $user) {
          purchasePlace
          category {
            name
            image
          }
          name
          user {
            firstName
          }
          description
          image
          listingDate
        }
      }
    `;
    const variables = { user: userId };
    const data = await this.graphqlClient.request(query, variables);
    return data.getListedProductsByUser;
  }

  async getListedProductById(productId) {
    const query = gql`
      query GetListedProductById($id: ID!) {
        getListedProductById(_id: $id) {
          purchasePlace
          description
          image
          name
          user {
            firstName
            lastName
            _id
          }
          listingDate
          category {
            name
          }
        }
      }
    `;
    const variables = { id: productId };
    const data = await this.graphqlClient.request(query, variables);
    return data.getListedProductById;
  }

  async getRequestsIMade() {
    const query = gql`
      query GetRequestsIMade {
        getRequestsIMade {
          _id
          active
          approved
          dateRequested
          place
          listingProduct {
            _id
            name
            purchasePlace
            category {
              _id
              name
            }
            description
            image
            listingDate
            user {
              email
              firstName
              lastName
              _id
            }
          }
        }
      }
    `;
    const data = await this.graphqlClient.request(query);
    return data.getRequestsIMade;
  }

  async getRequestsForProductIListed(listingProductId) {
    const query = gql`
      query GetRequestsForProductIListed($listingProduct: ID!) {
        getRequestsForProductIListed(listingProduct: $listingProduct) {
          _id
          active
          approved
          dateRequested
          place
          requestee {
            _id
            email
            firstName
            lastName
          }
          listingProduct {
            _id
            name
          }
        }
      }
    `;
    const variables = { listingProduct: listingProductId };
    const data = await this.graphqlClient.request(query, variables);
    return data.getRequestsForProductIListed;
  }

  async getMyListedProducts() {
    const query = gql`
      query GetMyListedProducts {
        getMyListedProducts {
          _id
          purchasePlace
          category {
            name
            _id
          }
          description
          image
          listingDate
          name
        }
      }
    `;
    const data = await this.graphqlClient.request(query);
    return data.getMyListedProducts;
  }

  /***** Mutations *****/

  async listAProduct(name, description, image, categoryId) {
    const mutation = gql`
      mutation listAProduct($name: String!, $description: String!, $image: String!, $category: ID!) {
        listAProduct(name: $name, description: $description, image: $image, category: $category) {
          name
          description
          image
        }
      }
    `;
    const variables = { name, description, image, category: categoryId };
    const data = await this.graphqlClient.request(mutation, variables);
    return data.listAProduct;
  }

  async requestAProduct(listingProduct, place) {
    const mutation = gql`
      mutation RequestAProduct($listingProduct: ID!, $place: String!) {
        requestAProduct(listingProduct: $listingProduct, place: $place) {
          active
          approved
          dateRequested
          place
        }
      }
    `;
    const variables = { listingProduct, place };
    const data = await this.graphqlClient.request(mutation, variables);
    return data.requestAProduct;
  }

  async editRequestedProduct(listingRequest, listingProduct, decision) {
    const mutation = gql`
      mutation EditRequestedProduct($listingRequest: ID!, $listingProduct: ID!, $decision: String!) {
        editRequestedProduct(listingRequest: $listingRequest, listingProduct: $listingProduct, decision: $decision) {
          _id
          active
          approved
          dateRequested
          place
        }
      }
    `;
    const variables = { listingRequest, listingProduct, decision };
    const data = await this.graphqlClient.request(mutation, variables);
    return data.editRequestedProduct;
  }
}

export const shopController = new ShopController();
