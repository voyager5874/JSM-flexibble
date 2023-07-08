export const userByEmailQuery = `
query GetUserByEmail($email: Email!){
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
