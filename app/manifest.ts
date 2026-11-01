import type { MetadataRoute } from "next";
import { HERO_NAME } from "@/constants/hero-constants";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/constants/seo-constants";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: HERO_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#080c10",
    theme_color: "#10b981",
    icons: [
      { src: "/icon.png", sizes: "32x32", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
