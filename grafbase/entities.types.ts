export type Project = {
  title: string;
  id: string;
  description: string;
  image: string;
  liveSiteUrl: string;
  githubUrl: string;
  createdBy: User;
  category: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  description: string;
  avatarUrl: string | null | undefined;
  linkedInUrl: string;
  projects: Project[];
};
