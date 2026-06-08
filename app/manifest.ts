import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yalla Book",
    short_name: "Yalla Book",
    description: "Social media platform",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1117",
    theme_color: "#0f1117",
    icons: [
      {
        src: "/icon/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
