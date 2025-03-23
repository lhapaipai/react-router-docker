import type { Media } from "prisma-client";

declare global {
  namespace PrismaJson {
    type MediaType = Media | null;
  }
}
