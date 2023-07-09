import { fetchProjectsFilteredByCategory } from "@/grafbase/database.actions";
import { ProjectCard } from "@/components/ProjectCard";

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
  if (projects.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <p className="no-result-text text-center">
          No projects found, go create some first.
        </p>
      </section>
    );
  }
  return (
    <div className="w-full items-center justify-between font-mono text-sm flex flex-col">
      <h1>Categories</h1>
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
