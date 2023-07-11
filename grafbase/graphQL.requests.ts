export const userByEmailQuery = `
query getUserByEmail($email: Email!){
  user(by: {email: $email}){
    id
    name
    email
    avatarUrl
    description
    githubUrl
    linkedInUrl
  }
}
`;

export const createUserMutation = `
mutation createUser($input: UserCreateInput!) {
  userCreate(input: $input) {
    user {
      id
      name
      email
      description
      avatarUrl
      githubUrl
      linkedInUrl
    }
  }
}`;
export const createProjectMutation = `
mutation createProject($input: ProjectCreateInput!){
  projectCreate(input: $input){
    project{
      title
      description
      image
      liveSiteUrl
      githubUrl
      category
      id
      createdBy{
        email
        name
        id
      }
    }
  }
}`;

export const getProjectsByCategoryQuery = `
  query getProjects($category: String, $endcursor: String, $first: Int) {
    projectSearch(first: $first, after: $endcursor, filter: {category: {eq: $category}}) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      searchInfo{
      totalHits
      }
      edges {
        node {
          title
          githubUrl
          description
          liveSiteUrl
          id
          image
          category
          createdBy {
            id
            email
            name
            avatarUrl
          }
        }
      }
    }
  }
`;

export const getProjectsBySearchTextQuery = `
  query getProjects($first: Int, $query: String, $fields: [String!], $endcursor: String) {
    projectSearch(first: $first, after: $endcursor, query: $query, fields: $fields) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      searchInfo{
      totalHits
      }
      edges {
        node {
          title
          githubUrl
          description
          liveSiteUrl
          id
          image
          category
          createdBy {
            id
            email
            name
            avatarUrl
          }
        }
      }
    }
  }
`;

export const getProjectByIdQuery = `
  query getProjectById($id: ID!) {
    project(by: { id: $id }) {
      id
      title
      description
      image
      liveSiteUrl
      githubUrl
      category
      createdBy {
        id
        name
        email
        avatarUrl
      }
    }
  }
`;

export const deleteProjectMutation = `
  mutation deleteProject($id: ID!) {
    projectDelete(by: { id: $id }) {
      deletedId
    }
  }
`;
