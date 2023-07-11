import { getProjectDetails } from "@/grafbase/database.actions";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/next-auth/auth.options";
import { ProjectActions } from "@/components/ProjectActions";

type Props = {
  params: {
    id: string;
  };
};
const Project = async ({ params: { id } }: Props) => {
  const session = await getServerSession(authOptions);
  const project = await getProjectDetails(id);
  if (!project?.project) {
    return <p className="no-result-text">Failed to fetch project info</p>;
  }
  const details = project?.project;
  const renderLink = () => `/profile/${details?.createdBy?.id}`;

  return (
    <>
      <h1 className={"text-3xl font-bold"}>{details?.title}</h1>;
      <section className="flexBetween gap-y-8 max-w-4xl max-xs:flex-col w-full">
        <div className="flex-1 flex items-start gap-5 w-full max-xs:flex-col">
          <Link href={renderLink()}>
            <Image
              src={details?.createdBy?.avatarUrl || "/user.svg"}
              width={50}
              height={50}
              alt="profile"
              className="rounded-full"
            />
          </Link>

          <div className="flex-1 flexStart flex-col gap-1">
            <p className="self-start text-lg font-semibold">{details?.title}</p>
            <div className="user-info">
              <Link href={renderLink()}>{details?.createdBy?.name}</Link>
              <Image src="/dot.svg" width={4} height={4} alt="dot" />
              <Link
                href={`/?category=${details.category}`}
                className="text-primary-purple font-semibold"
              >
                {details?.category}
              </Link>
            </div>
          </div>
        </div>

        {session?.user?.email === details?.createdBy?.email && (
          <div className="flex justify-end items-center gap-2">
            <ProjectActions projectId={details?.id} />
          </div>
        )}
      </section>
      <section className="mt-14">
        <Image
          src={`${details?.image}`}
          className="object-cover rounded-2xl"
          width={1064}
          height={798}
          alt="poster"
        />
      </section>
    </>
  );
};

export default Project;
