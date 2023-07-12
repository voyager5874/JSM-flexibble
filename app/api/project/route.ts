import { NextRequest, NextResponse } from "next/server";
import { createNewProject } from "@/grafbase/database.actions";

export async function POST(request: NextRequest) {
  const { data, creatorId, token } = await request.json();
  try {
    const res = await createNewProject(data, creatorId, token);
    return NextResponse.json(res?.projectCreate.project, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    return new NextResponse(`Error during new project posting ${message}`, {
      status: 500,
    });
  }
}
