import { Project } from "@/grafbase/entities.types";

export const createProjectViaApi = async (
  data: Omit<Project, "createdBy" | "id">,
  creatorId: string,
  token: string
) => {
  try {
    return await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
        creatorId,
        token,
      }),
    });
  } catch (err) {
    console.log("db-actions/clientside-wrapper/post/error", err);
    throw err;
  }
};

export const deleteProjectViaApi = async (id: string, token: string) => {
  try {
    return await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/project/${id}?token=${token}`,
      {
        method: "DELETE",
      }
    );
  } catch (err) {
    console.log("db-actions/clientside-wrapper/delete/error", err);
    throw err;
  }
};

export const editProjectViaApi = async (
  id: string,
  data: Partial<Omit<Project, "createdBy" | "id">>,
  token: string
) => {
  try {
    return await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/project/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
        token,
      }),
    });
  } catch (err) {
    console.log("db-actions/clientside-wrapper/put/error", err);
    throw err;
  }
};
