import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.client.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.activityType.deleteMany({});
  await prisma.user.deleteMany({});
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
