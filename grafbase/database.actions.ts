import {
  createUserMutation,
  userByEmailQuery,
} from "@/grafbase/graphQL.requests";
import { makeGraphQLRequest } from "@/grafbase/database.client";
import { User } from "@/grafbase/entities.types";

export const findUserInDB = (
  email: string
): Promise<{ user: User | undefined }> => {
  return makeGraphQLRequest(userByEmailQuery, { email });
};

export const createUser = (
  userData: Pick<User, "name" | "avatarUrl" | "email">
) => {
  const variables = {
    input: {
      ...userData,
    },
  };

  return makeGraphQLRequest(createUserMutation, variables);
};
