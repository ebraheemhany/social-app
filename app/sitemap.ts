import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://your-app.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://your-app.vercel.app/explore",
      lastModified: new Date(),
    },
    {
      url: "https://your-app.vercel.app/sign-in",
      lastModified: new Date(),
    },
    {
      url: "https://your-app.vercel.app/sign-up",
      lastModified: new Date(),
    },
  ];
}
