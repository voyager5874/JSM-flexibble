import { Project, User } from "@/grafbase/entities.types";

export type PageInfoType = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

export type CollectionType<T> = {
  pageInfo: PageInfoType;
  edges: Array<{ node: T }>;
};

type Error = {
  message: string;
  locations: [
    {
      line: number;
      column: number;
    }
  ];
  path: string[];
};

export type ErrorResponse = {
  errors: Error[];
};

export type ProjectBySearchQueryResponse = {
  projectSearch: CollectionType<Project> & {
    searchInfo: {
      totalHits: number;
    };
  };
};

export type ProjectCollectionQueryResponse = {
  projectCollection: CollectionType<Project>;
};

export type ProjectDeleteMutationResponse = {
  projectDelete: {
    deletedId: string;
  };
};

export type UserQueryResponse = {
  user: User & {
    projects: CollectionType<Project>;
  };
};
