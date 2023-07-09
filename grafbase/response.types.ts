import { Project } from "@/grafbase/entities.types";

export type ProjectBySearchQueryResponse = {
  projectSearch: {
    edges: { node: Project }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    searchInfo: {
      totalHits: number;
    };
  } | null;
};

export type ProjectCollectionQueryResponse = {
  projectCollection: {
    edges: { node: Project }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
};
