import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://social-app-8jsk.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://social-app-8jsk.vercel.app/explore",
      lastModified: new Date(),
    },
    {
      url: "https://social-app-8jsk.vercel.app/sign-in",
      lastModified: new Date(),
    },
    {
      url: "https://social-app-8jsk.vercel.app/sign-up",
      lastModified: new Date(),
    },
  ];
}
