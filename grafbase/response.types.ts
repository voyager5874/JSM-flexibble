import { Project, User } from "@/grafbase/entities.types";

type PageInfoType = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string;
  endCursor: string;
};

type CollectionType<T> = {
  pageInfo: PageInfoType;
  edges: {
    node: T[];
  };
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

// export type ProjectBySearchQueryResponse = {
//   projectSearch: {
//     edges: { node: Project }[];
//     pageInfo: PageInfoType;
//     searchInfo: {
//       totalHits: number;
//     };
//   } | null;
// };
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
