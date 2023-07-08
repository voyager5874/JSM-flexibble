export const uploadImage = async (imagePath: string) => {
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
    return response.json();
  } catch (err) {
    console.log("cloudinary/actions/upload/error", err);
    throw err;
  }
};
