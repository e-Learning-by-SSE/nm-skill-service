import * as argon from 'argon2';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users = [
  {
    email: 'elscha@sse.de',
    name: 'Sascha',
    pw: 'pw',
    id: '1',
  },
];

const repositories = [
  {
    id: '1',
    user: '1',
    name: 'Java OO Repository',
    description: 'Example to demonstrate competence modelling capabilities',
    taxonomy: 'Bloom',
    version: 'v1',
  },
];

const competencies = [
  {
    id: '1',
    repository: '1',
    name: 'Literals',
    description: 'Constant expressions',
    level: 3,
  },
  {
    id: '2',
    repository: '1',
    name: 'Primitive Datatypes & Operators',
    description: '',
    level: 3,
  },
  {
    id: '3',
    repository: '1',
    name: 'Variables',
    description: 'Variable Usage in Expressions',
    level: 3,
  },
  {
    id: '4',
    repository: '1',
    name: 'if-statement',
    description: 'if wo/ else',
    level: 3,
  },
  {
    id: '5',
    repository: '1',
    name: 'else-statement',
    description: 'else-statement',
    level: 3,
  },
  {
    id: '6',
    repository: '1',
    name: 'if-block',
    description: 'Using curly brackets to nest more than 1 statement',
    level: 3,
  },
  {
    id: '7',
    repository: '1',
    name: 'if nesting',
    description: 'Nest multiple if-statements',
    level: 3,
  },
  {
    id: '8',
    repository: '1',
    name: 'Compiler Usage',
    description: 'How to use commands: javac & java',
    level: 3,
  },
];

const ueberCompetencies = [
  {
    id: '1',
    repository: '1',
    name: 'Expressions',
    description: 'Complete understanding of expressions in Java',
    nestedCompetencies: ['1', '2', '3'],
    nestedUeberCompetencies: [],
    parents: [],
  },
  {
    id: '2',
    repository: '1',
    name: 'if/else concept',
    description: 'Complete understanding if/else in Java',
    nestedCompetencies: ['4', '5', '6', '7'],
    nestedUeberCompetencies: ['1'],
    // parents: [],
  },
];

async function seed(): Promise<void> {
  console.log('😅 Seeding...');
  await createUsers();
  console.log('✅ Users');
  await createRepositories();
  console.log('✅ Repositories');
  createCompetencies();
  console.log('✅ Competencies');
  // wait 1 second
  await new Promise((f) => setTimeout(f, 1000));
  createUeberCompetencies();
  console.log('✅ Ueber-Competencies');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function createUsers() {
  await Promise.all(
    users.map(async (user) => {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          pw: await argon.hash(user.pw),
        },
      });
    }),
  );
}

async function createRepositories() {
  await Promise.all(
    repositories.map(async (repo) => {
      await prisma.repository.create({
        data: {
          id: repo.id,
          userId: repo.user,
          name: repo.name,
          description: repo.description,
          taxonomy: repo.taxonomy,
          version: repo.version,
        },
      });
    }),
  );
}

async function createCompetencies() {
  await Promise.all(
    competencies.map(async (competence) => {
      await prisma.competence.create({
        data: {
          id: competence.id,
          repositoryId: competence.repository,
          skill: competence.name,
          level: competence.level,
          description: competence.description,
        },
      });
    }),
  );
}

async function createUeberCompetencies() {
  // Need to preserve ordering and wait to be finished before creating the next one!
  for (const competence of ueberCompetencies) {
    const competencies = competence.nestedCompetencies?.map((i) => ({ id: i }));
    const ueberCompetencies = competence.nestedUeberCompetencies?.map((i) => ({ id: i }));
    // const parents = competence.parents?.map((i) => ({ id: i }));

    await prisma.ueberCompetence.create({
      data: {
        id: competence.id,
        repositoryId: competence.repository,
        name: competence.name,
        description: competence.description,
        subCompetences: {
          connect: competencies,
        },
        subUeberCompetences: {
          connect: ueberCompetencies,
        },
      },
    });
  }
}
