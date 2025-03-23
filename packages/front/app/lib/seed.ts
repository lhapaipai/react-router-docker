import { prisma } from "./prisma";

async function seed() {
  await prisma.user.create({
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
