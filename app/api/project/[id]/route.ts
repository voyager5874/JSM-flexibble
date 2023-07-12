import { NextRequest, NextResponse } from "next/server";
import { deleteProject, editProject } from "@/grafbase/database.actions";

type ParamsType = {
  params: {
    id: string;
  };
};
export async function DELETE(request: NextRequest, { params }: ParamsType) {
  try {
    const { id } = params;
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!id) throw new Error("no project id provided");
    if (!token) throw new Error("unauthorized");
    const res = await deleteProject(id, token);
    if (res?.projectDelete?.deletedId === id) {
      return NextResponse.json(
        { message: `${res?.projectDelete?.deletedId} deleted` },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json("unexpected server response", { status: 500 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    return new NextResponse(`Error deleting project ${message}`, {
      status: 500,
    });
  }
}

export async function PUT(request: NextRequest, { params }: ParamsType) {
  try {
    const { id } = params;
    const { data, token } = await request.json();
    if (!id) throw new Error("no project id provided");
    if (!token) throw new Error("unauthorized");
    const res = await editProject(id, data, token);
    return NextResponse.json(res?.projectUpdate.project, { status: 200 });
  } catch (err) {
    console.log(err);
    const message = err instanceof Error ? err.message : "";
    return new NextResponse(`Error editing project ${message}`, {
      status: 500,
    });
  }
}
