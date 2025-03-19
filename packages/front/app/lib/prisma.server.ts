import { PrismaClient } from "@prisma/client";
import { singleton } from "./singleton";

export const prisma = singleton("prisma", () => {
  const client = new PrismaClient();
  return client;
});
