import type { MetadataRoute } from "next";
import { metaDescription, profile } from "@/app/components/portfolio/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.fullName,
    short_name: profile.fullName,
    description: metaDescription,
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
