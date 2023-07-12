import { ProjectForm } from "@/components/ProjectForm/ProjectForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/next-auth/auth.options";
import { redirect } from "next/navigation";
import { getProjectDetails } from "@/grafbase/database.actions";

type Props = {
  params: {
    id: string;
  };
};
const EditProject = async ({ params: { id } }: Props) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");
  const project = await getProjectDetails(id);
  if (!project?.project) {
    return <h1>Error</h1>;
  }
  return (
    <div className="w-full flex flex-col gap-10 items-center">
      <h1 className="text-2xl font-bold">Edit the project</h1>
      <ProjectForm
        type={"edit"}
        user={session?.user!}
        project={project.project}
      />
    </div>
  );
};

export default EditProject;
