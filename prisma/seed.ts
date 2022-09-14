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
    name: 'Compiler Calling',
    description: 'Calling javac, wo/ knowing what it exactly does',
    level: 1,
  },
  {
    id: '2',
    repository: '1',
    name: 'Interpreter Calling',
    description: 'Calling java, wo/ knowing what it exactly does',
    level: 1,
  },
  {
    id: '3',
    repository: '1',
    name: 'Compiler Usage',
    description: 'Knowing how & why to use javac',
    level: 3,
  },
  {
    id: '4',
    repository: '1',
    name: 'Interpreter Usage',
    description: 'Knowing how & why to use java',
    level: 3,
  },
  {
    id: '5',
    repository: '1',
    name: 'Literals',
    description: 'Constant expressions',
    level: 3,
  },
  {
    id: '6',
    repository: '1',
    name: 'Primitive Datatypes & Operators',
    description: '',
    level: 3,
  },
  {
    id: '7',
    repository: '1',
    name: 'Variables',
    description: 'Variable Usage in Expressions',
    level: 3,
  },
  {
    id: '8',
    repository: '1',
    name: 'Expressions',
    description: 'Knwoing how to forumalte arbitrary expressions on primitives',
    level: 3,
  },
  {
    id: '9',
    repository: '1',
    name: 'if-statement',
    description: 'if wo/ else',
    level: 3,
  },
  {
    id: '10',
    repository: '1',
    name: 'else-statement',
    description: 'else-statement',
    level: 3,
  },
  {
    id: '11',
    repository: '1',
    name: 'if-block',
    description: 'Using curly brackets to nest more than 1 statement',
    level: 3,
  },
  {
    id: '12',
    repository: '1',
    name: 'if nesting',
    description: 'Nest multiple if-statements',
    level: 3,
  },
  {
    id: '13',
    repository: '1',
    name: 'switch/case basics',
    description: 'switch, case, break, default',
    level: 3,
  },
  {
    id: '14',
    repository: '1',
    name: 'switch/case advanced',
    description: 'falls through, expressions, strings',
    level: 3,
  },
  {
    id: '15',
    repository: '1',
    name: 'Programm Structure',
    description: 'Knowing how to add own code into a template',
    level: 1,
  },
];

const ueberCompetencies = [
  {
    id: '1',
    repository: '1',
    name: 'Commands Usage',
    description: 'Commands to compile and execute own programms, wo/ deeper understanding',
    nestedCompetencies: ['1', '2'],
    nestedUeberCompetencies: [],
  },
  {
    id: '2',
    repository: '1',
    name: 'Commands Understanding',
    description: 'Commands to compile and execute own programms, wo/ deeper understanding',
    nestedCompetencies: ['3', '4'],
    nestedUeberCompetencies: [],
  },
  {
    id: '3',
    repository: '1',
    name: 'Expressions',
    description: 'Complete understanding of expressions in Java',
    nestedCompetencies: ['5', '6', '7', '8'],
    nestedUeberCompetencies: [],
  },
  {
    id: '4',
    repository: '1',
    name: 'if/else concept',
    description: 'Complete understanding of if/else in Java',
    nestedCompetencies: ['9', '10', '11', '12'],
    nestedUeberCompetencies: ['3'],
  },
  {
    id: '5',
    repository: '1',
    name: 'switch/case concept',
    description: 'Complete understanding of switch/case in Java',
    nestedCompetencies: ['13', '14'],
    nestedUeberCompetencies: ['3'],
  },
  {
    id: '6',
    repository: '1',
    name: 'Branching',
    description: 'if/else and switch/case',
    nestedCompetencies: [],
    nestedUeberCompetencies: ['4', '5'],
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
