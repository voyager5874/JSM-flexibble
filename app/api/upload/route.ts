import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const { path } = await request.json();
  if (!path) {
    return NextResponse.json(
      { message: "Image path is required" },
      { status: 400 }
    );
  }

  try {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      transformation: [
        // transformation: [{ width: 1000, height: 752, crop: "fill" }],
        // { crop: "fill", aspect_ratio: "1:1", gravity: "auto", width: 500 },
        { crop: "fill", gravity: "auto", width: 1000 },
      ],
    };

    const result = await cloudinary.uploader.upload(path, options);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("api/upload", error);
    return new NextResponse("api/upload/endpoint/error", { status: 500 });
  }
}
