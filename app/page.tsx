import PortfolioPage from "@/app/components/portfolio/portfolio-page";
import { education, profile, services } from "@/app/components/portfolio/data";
import { getPublishedProjects } from "@/app/lib/admin/storage";
import { siteUrl } from "@/app/lib/site";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  givenName: profile.firstName,
  familyName: profile.surname,
  jobTitle: profile.jobTitle,
  description: profile.summary,
  email: profile.email,
  url: siteUrl,
  image: `${siteUrl}${profile.portrait}`,
  address: { "@type": "PostalAddress", addressCountry: "PH" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: education.school,
  },
  knowsAbout: [
    ...services.flatMap((service) => [service.title, ...service.items]),
    "PHP",
    "ERP implementation",
    "AI coding agents",
  ],
  sameAs: [profile.linkedin.href, profile.upwork.href, profile.onlineJobs.href],
};

// Published projects are re-read every minute, and straight away after any
// save in the staff area (revalidatePath), so no redeploy is needed.
export const revalidate = 60;

export default async function Home() {
  const projects = await getPublishedProjects();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <PortfolioPage projects={projects} />
    </>
  );
}
