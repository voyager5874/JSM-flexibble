import { fetchProjectsFilteredByCategory } from "@/grafbase/database.actions";
import { ProjectCard } from "@/components/ProjectCard";
import { Categories } from "@/components/Categories";

type SearchParams = {
  category?: string | null;
  endcursor?: string | null;
};

type Props = {
  searchParams: SearchParams;
};

export default async function Home({
  searchParams: { endcursor, category },
}: Props) {
  const data = await fetchProjectsFilteredByCategory(category, endcursor);
  const projects = data?.projectSearch?.edges || [];
  if (projects?.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />
        <p className="h-[600px] flex flexCenter text-2xl">
          No projects found, go create some first.
        </p>
      </section>
    );
  }
  return (
    <div className="flexStart flex-col paddings mb-16">
      <Categories />
      <section className="projects-grid">
        {projects.map(({ node }) => (
          <ProjectCard
            key={`${node?.id}`}
            id={node?.id}
            image={node?.image}
            title={node?.title}
            name={node?.createdBy.name}
            avatarUrl={node?.createdBy?.avatarUrl || "/user.svg"}
            userId={node?.createdBy.id}
          />
        ))}
      </section>
      <button>LoadMore</button>
    </div>
  );
}
