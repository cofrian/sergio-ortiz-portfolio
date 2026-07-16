import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Sergio Ortiz — Portfolio", short_name: "Sergio Ortiz", description: "Data Science, AI Engineering, MLOps and applied research.", start_url: "/en", display: "standalone", background_color: "#f7f5ef", theme_color: "#064e47" };
}
