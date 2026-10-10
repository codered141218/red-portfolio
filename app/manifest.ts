import type { MetadataRoute } from "next";
import { profile } from "@/app/components/portfolio/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.firstName} ${profile.lastName} | ${profile.role}`,
    short_name: `${profile.firstName} ${profile.lastName}`,
    description: profile.summary,
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
