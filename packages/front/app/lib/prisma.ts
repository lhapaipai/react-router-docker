import { PrismaClient } from "database";
import { singleton } from "./util/singleton";

export const prisma = singleton("prisma", () => {
  const client = new PrismaClient();
  return client;
});
