import { prisma } from "~/lib/prisma.server";

async function seed() {
  const user = await prisma.user.create({
    data: {
      email: "hugues@pentatrion.com",
      name: "lhapaipai",
    },
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    await prisma.$disconnect();
    console.error(err);
    process.exit(1);
  });
