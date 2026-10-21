import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://janic.edu.so";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/what-we-do",
    "/innovation-hub",
    "/projects",
    "/training",
    "/research",
    "/events",
    "/partnerships",
    "/contact",
    "/posts",
    "/faq",
    "/submit-innovation",
    "/register",
  ];

  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
