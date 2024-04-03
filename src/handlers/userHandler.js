import { gql, request } from 'graphql-request';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!, $firstName: String!, $lastName: String!, $roomNumber: Int!) {
    register(username: $username, password: $password, firstName: $firstName, lastName: $lastName, roomNumber: $roomNumber)
  }
`;

async function registerUser(req, res) {
    const { username, password, firstName, lastName, roomNumber } = req.body;
    try {
        await request(process.env.USER_SERVICE_URL, REGISTER_MUTATION, {
            username,
            password,
            firstName,
            lastName,
            roomNumber,
        });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);

        let message = 'An unexpected error occurred';
        let statusCode = 500;

        if (error.response && error.response.errors && error.response.errors.length > 0) {
            // Handle structured GraphQL errors
            message = error.response.errors[0].message;
            if (message === "User already exists") {
                statusCode = 409;
            }
        } else if (error.message) {
            // Handle other errors (e.g., network issues, configuration errors)
            message = error.message;
        }

        res.status(statusCode).json({ error: message });
    }
}


async function loginUser(req, res) {
    const { username, password } = req.body;
    try {
        const data = await request(process.env.USER_SERVICE_URL, LOGIN_MUTATION, { username, password });
        res.status(200).json({ token: data.login });
    } catch (error) {
        const message = error.response?.errors?.[0]?.message || 'An unexpected error occurred';
        res.status(500).json({ error: message });
    }
}

export { registerUser, loginUser };

