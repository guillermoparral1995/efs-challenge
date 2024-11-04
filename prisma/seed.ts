import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('./prisma/seed.json', 'utf-8'));

  for (const item of data) {
    // find all items that have the same id OR the same name, these would be repeated items
    const prevItem = await prisma.application.findMany({
      where: {
        OR: [
          {
            id: Number(item.id),
          },
          {
            name: item.name,
          },
        ],
      },
    });
    // if none, then it's safe to add to DB
    if (!prevItem.length) {
      await prisma.application.create({
        data: {
          ...item,
          id: Number(item.id),
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
