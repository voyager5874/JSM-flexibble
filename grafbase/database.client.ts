import { GraphQLClient } from "graphql-request";

const grafbaseApiUrl = process.env.GRAFBASE_API_URL || "";
const grafbaseApiKey = process.env.GRAFBASE_API_KEY || "";

export const client = new GraphQLClient(grafbaseApiUrl, {
  headers: {
    "x-api-key": grafbaseApiKey,
  },
});

export const makeGraphQLRequest = async <T = unknown>(
  query: string,
  variables = {}
): Promise<T> => {
  try {
    return await client.request(query, variables);
  } catch (err) {
    console.log("db client error", err);
    throw err;
  }
};
