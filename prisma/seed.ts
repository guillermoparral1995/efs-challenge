import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('./prisma/seed.json', 'utf-8'));

  for (const item of data) {
    const prevItem = await prisma.application.findMany({
      where: {
        id: parseInt(item.id),
      },
    });
    if (!prevItem.length) {
      await prisma.application.create({
        data: {
          ...item,
          id: parseInt(item.id),
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
