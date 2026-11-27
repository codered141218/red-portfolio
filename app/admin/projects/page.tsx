import { requireSession } from "@/app/lib/admin/auth";
import { blobConfigured } from "@/app/lib/admin/config";
import { getAllProjects, StorageError } from "@/app/lib/admin/storage";
import type { Project } from "@/app/lib/admin/types";
import AdminShell from "../admin-shell";
import ProjectList from "./project-list";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string }>;
}) {
  const session = await requireSession();
  const { published } = await searchParams;

  let projects: Project[] = [];
  let problem: "not-configured" | "unavailable" | null = null;
  if (!blobConfigured()) problem = "not-configured";
  else {
    try {
      projects = await getAllProjects();
    } catch (error) {
      problem = error instanceof StorageError ? error.code : "unavailable";
    }
  }

  return (
    <AdminShell csrf={session.csrf}>
      <ProjectList
        projects={projects.map((p) => ({
          id: p.id,
          title: p.title,
          summary: p.summary,
          status: p.status,
          cover: p.images[0]?.url ?? null,
          count: p.images.length,
          updatedAt: p.updatedAt,
        }))}
        problem={problem}
        csrf={session.csrf}
        justPublished={published === "1"}
      />
    </AdminShell>
  );
}
