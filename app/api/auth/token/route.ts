import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret, raw: true });

    return NextResponse.json({ token }, { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse("getToken failed", { status: 500 });
  }
}
