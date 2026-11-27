import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/admin/auth";
import { authConfigured } from "@/app/lib/admin/config";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>;
}) {
  if (!authConfigured()) {
    return (
      <main id="main-content" className="login-card">
        <h1>Staff area isn&apos;t set up yet</h1>
        <p className="muted">
          Add the sign-in settings in Vercel, then redeploy. The steps are in
          the README under &quot;How to set up&quot;.
        </p>
      </main>
    );
  }
  if (await getSession()) redirect("/admin/projects");
  const { expired } = await searchParams;
  return <LoginForm expired={expired === "1"} />;
}
