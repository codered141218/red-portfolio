import PortfolioPage from "@/app/components/portfolio/portfolio-page";
import { education, profile, services } from "@/app/components/portfolio/data";
import { siteUrl } from "@/app/lib/site";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  givenName: profile.firstName,
  familyName: profile.surname,
  jobTitle: profile.role,
  description: profile.summary,
  email: `mailto:${profile.email}`,
  url: siteUrl,
  image: `${siteUrl}${profile.portrait}`,
  address: { "@type": "PostalAddress", addressCountry: "PH" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: education.school,
  },
  knowsAbout: services.flatMap((service) => [service.title, ...service.items]),
  sameAs: [profile.linkedin.href, profile.onlineJobs.href],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <PortfolioPage />
    </>
  );
}
