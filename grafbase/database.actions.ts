import {
  createProjectMutation,
  createUserMutation,
  deleteProjectMutation,
  getProjectByIdQuery,
  getProjectsByCategoryQuery,
  getProjectsBySearchTextQuery,
  getUserByIdWithProjectsQuery,
  updateProjectMutation,
  userByEmailQuery,
} from "@/grafbase/graphQL.requests";
import { client, makeGraphQLRequest } from "@/grafbase/database.client";
import { Project, User } from "@/grafbase/entities.types";
import { uploadImage } from "@/services/cloudinary/cloudinary.actions";
import {
  ProjectBySearchQueryResponse,
  ProjectDeleteMutationResponse,
  UserQueryResponse,
} from "@/grafbase/response.types";

export const findUserInDB = (
  email: string
): Promise<UserQueryResponse | null> => {
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
): Promise<{ projectCreate: { project: Partial<Project> } } | null> => {
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
  return null;
};

export const fetchProjectsFilteredByCategory = async (
  category?: string | null,
  endcursor?: string | null,
  first: number = 100
): Promise<ProjectBySearchQueryResponse> => {
  return makeGraphQLRequest(getProjectsByCategoryQuery, {
    category,
    endcursor,
    first,
  });
};

export const fetchProjectsFilteredBySearchText = async (
  first: number = 8,
  query: string,
  fields?: keyof Project,
  endcursor?: string | null
): Promise<ProjectBySearchQueryResponse> => {
  return makeGraphQLRequest(getProjectsBySearchTextQuery, {
    first,
    query,
    fields,
    endcursor,
  });
};

export const getProjectDetails = (
  id: string
): Promise<{ project: Project | undefined } | undefined> => {
  return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const deleteProject = (
  id: string,
  token: string
): Promise<ProjectDeleteMutationResponse> => {
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation, { id });
};

export const getUserByIdWithProjects = (
  id: string,
  last?: number
): Promise<UserQueryResponse | null> => {
  return makeGraphQLRequest(getUserByIdWithProjectsQuery, { id, last });
};

export const editProject = async (
  id: string,
  update: Partial<Omit<Project, "createdBy" | "id">>,
  token: string
): Promise<{ projectUpdate: { project: Partial<Project> } } | null> => {
  // const currentData = await getProjectDetails(id);
  // if (!currentData?.project) throw new Error("Couldn't get project data");
  let imageUrl = null;
  if (update?.image) {
    imageUrl = await uploadImage(update.image);
  }
  client.setHeader("Authorization", `Bearer ${token}`);

  const variables = imageUrl?.url
    ? {
        id,
        input: {
          ...update,
          image: imageUrl?.url,
        },
      }
    : {
        id,
        input: {
          ...update,
        },
      };
  return makeGraphQLRequest(updateProjectMutation, variables);
};
