import {
  createProjectMutation,
  createUserMutation,
  deleteProjectMutation,
  getAllProjectsQuery,
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
  PageInfoType,
  ProjectBySearchQueryResponse,
  ProjectCollectionQueryResponse,
  ProjectDeleteMutationResponse,
  UserQueryResponse,
} from "@/grafbase/response.types";
import { UploadResponse } from "@/services/cloudinary/response.types";

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
  if (imageUrl?.url) {
    client.setHeader("Authorization", `Bearer ${token}`);

    const variables = {
      input: {
        ...data,
        image: imageUrl?.url,
        createdBy: {
          link: creatorId,
        },
      },
    };
    return makeGraphQLRequest(createProjectMutation, variables);
  }
  return null;
};

function isSearch(obj: any): obj is ProjectBySearchQueryResponse {
  return obj && typeof obj === "object" && "projectSearch" in obj;
}

function isCollection(obj: any): obj is ProjectCollectionQueryResponse {
  return obj && typeof obj === "object" && "projectCollection" in obj;
}

export const fetchProjectsFilteredByCategory = async (
  category?: string | null,
  endcursor?: string | null,
  first: number = 100
): Promise<{
  pageInfo: PageInfoType;
  projects: { node: Project }[];
} | null> => {
  const vars = { category, endcursor, first };
  console.log("fetchProjectsFilteredByCategory/variables", vars);
  //grafbase client throws error in production when category is null,
  //graphQL playgrounds accept category === null just fine
  const res = category
    ? await makeGraphQLRequest(getProjectsByCategoryQuery, vars)
    : await makeGraphQLRequest(getAllProjectsQuery, { first });
  console.log("fetchProjectsFilteredByCategory/result", res);
  if (isSearch(res))
    return {
      pageInfo: res.projectSearch.pageInfo,
      projects: res.projectSearch.edges,
    };
  if (isCollection(res))
    return {
      pageInfo: res.projectCollection.pageInfo,
      projects: res.projectCollection.edges,
    };
  return null;
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
  let imageUrl = null as null | UploadResponse;
  if (update?.image) {
    imageUrl = await uploadImage(update.image);
  }
  client.setHeader("Authorization", `Bearer ${token}`);

  const variables =
    imageUrl && imageUrl?.url
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
