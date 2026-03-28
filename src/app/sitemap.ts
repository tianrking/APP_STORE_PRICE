import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://apple.w0x7ce.eu";
  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: "daily",
      priority: 1
    }
  ];
}
