import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wade Hammes",
    short_name: "Wade Hammes",
    description:
      "Wade is a software engineer for Rhythm Energy, helping build the best customer experience in retail renewable energy, and a co-founder of Provisioner, a full-service creative agency helping to grow brands.",
    start_url: "/",
    display: "standalone",
    background_color: "#171717",
    theme_color: "#171717",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
