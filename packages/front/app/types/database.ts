import type { Media } from "database";

declare global {
  namespace PrismaJson {
    type MediaType = Media | null;
  }
}
