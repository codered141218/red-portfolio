import Link from "next/link";
import { requireSession } from "@/app/lib/admin/auth";
import { getProject } from "@/app/lib/admin/storage";
import type { Project } from "@/app/lib/admin/types";
import AdminShell from "../../admin-shell";
import ProjectForm from "../project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;

  let project: Project | null = null;
  let problem = false;
  try {
    project = await getProject(id);
  } catch {
    problem = true;
  }

  return (
    <AdminShell csrf={session.csrf}>
      {project ? (
        <ProjectForm csrf={session.csrf} initial={project} />
      ) : (
        <div className="empty-card">
          <h1>{problem ? "We couldn't load this project." : "That project doesn't exist."}</h1>
          <Link href="/admin/projects" className="button button-secondary">
            Back to projects
          </Link>
        </div>
      )}
    </AdminShell>
  );
}
