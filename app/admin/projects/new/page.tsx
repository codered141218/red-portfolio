import { requireSession } from "@/app/lib/admin/auth";
import AdminShell from "../../admin-shell";
import ProjectForm from "../project-form";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const session = await requireSession();
  return (
    <AdminShell csrf={session.csrf}>
      <ProjectForm csrf={session.csrf} initial={null} />
    </AdminShell>
  );
}
