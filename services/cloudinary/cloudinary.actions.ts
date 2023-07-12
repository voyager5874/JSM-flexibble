import { UploadResponse } from "@/services/cloudinary/response.types";

export const uploadImage = async (
  imagePath: string
): Promise<UploadResponse | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/upload`,
      {
        method: "POST",
        body: JSON.stringify({
          path: imagePath,
        }),
      }
    );
    const json = await response.json();
    console.log("imageUrl", json);
    return json;
  } catch (err) {
    console.log("cloudinary/actions/upload/error", err);
    throw err;
  }
};
