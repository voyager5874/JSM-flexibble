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
    console.log("cloudinary/actions/upload/error", err);
    throw err;
  }
};
