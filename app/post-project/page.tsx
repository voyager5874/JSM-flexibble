import { ProjectForm } from "@/components/ProjectForm/ProjectForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/next-auth/auth.options";
import { redirect } from "next/navigation";

const PostProject = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");
  return (
    <div className="w-full flex flex-col gap-10 items-center">
      <h1 className="text-2xl font-bold">Post new project</h1>
      <ProjectForm type={"post"} user={session?.user!} />
    </div>
  );
};

export default PostProject;
