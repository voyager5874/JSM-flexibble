import {
  createProjectMutation,
  createUserMutation,
  userByEmailQuery,
} from "@/grafbase/graphQL.requests";
import { client, makeGraphQLRequest } from "@/grafbase/database.client";
import { Project, User } from "@/grafbase/entities.types";
import { uploadImage } from "@/services/cloudinary/cloudinary.actions";

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

export const createNewProject = async (
  data: Omit<Project, "createdBy">,
  creatorId: string,
  token: string
): Promise<{ projectCreate: { project: Partial<Project> | undefined } }> => {
  const imageUrl = await uploadImage(data.image);
  if (imageUrl.url) {
    client.setHeader("Authorization", `Bearer ${token}`);

    const variables = {
      input: {
        ...data,
        image: imageUrl.url,
        createdBy: {
          link: creatorId,
        },
      },
    };
    return makeGraphQLRequest(createProjectMutation, variables);
  }
  return { projectCreate: { project: undefined } };
};
