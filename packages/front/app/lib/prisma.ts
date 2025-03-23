import { PrismaClient } from "prisma-client";
import { singleton } from "./util/singleton";

export const prisma = singleton("prisma", () => {
  const client = new PrismaClient();
  return client;
});
