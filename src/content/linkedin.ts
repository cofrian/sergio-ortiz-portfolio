import { z } from "zod";
import rawPosts from "../../content/linkedin-posts.json";

const linkedInPostSchema = z.object({
  id: z.string().min(1).max(180),
  url: z.url().refine((url) => url.startsWith("https://www.linkedin.com/")),
  title: z.string().min(3).max(180),
  excerpt: z.string().min(10).max(700),
  content: z.string().min(10).max(20_000).optional(),
  publishedAt: z.iso.date(),
  categories: z.array(z.string().min(1).max(60)).min(1).max(6),
  image: z.union([
    z.literal(""),
    z.url().refine((url) => url.startsWith("https://")),
    z.string().regex(/^\/images\/linkedin\/[a-z0-9-]+\.(?:jpe?g|webp|png)$/),
  ]).optional(),
  imageFit: z.enum(["cover", "contain"]).default("cover"),
  spotifyUrl: z.url()
    .refine((url) => url.startsWith("https://open.spotify.com/episode/"))
    .optional(),
  spotifyTitle: z.string().min(3).max(180).optional(),
  featured: z.boolean().default(false),
  needsEditorialReview: z.boolean().default(false),
});

export const linkedinPosts = z.array(linkedInPostSchema).parse(rawPosts);
