import { PrismaClient } from '@prisma/client';

import { javaSeed } from './java_example_seed';

const prisma = new PrismaClient();

async function seed(): Promise<void> {
  console.log('Seeding... 😅');

  console.log('\x1b[34m%s\x1b[0m', 'Java Example');
  await javaSeed();
  console.log('\x1b[34m%s\x1b[32m ✔\x1b[0m', 'Java Example');
  // console.log('Java Example ✅');

  console.log('Seeding completed 😎');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
