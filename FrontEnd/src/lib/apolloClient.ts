import { ApolloClient, InMemoryCache } from '@apollo/client';

const BACKEND_URL: string | undefined = process.env.NEXT_PUBLIC_VITE_BACKEND_URL;

export const apolloClient = new ApolloClient({
  uri: `${BACKEND_URL}/graphql`, // replace with your GraphQL API URL
  cache: new InMemoryCache(),
});
