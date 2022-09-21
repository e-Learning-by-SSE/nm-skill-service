import * as argon from 'argon2';

import { LoRepository, PrismaClient } from '@prisma/client';

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
    description: 'Knowing how to formulate arbitrary expressions on primitives',
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
    name: 'Program Structure I',
    description: 'Knowing how to add own code into a template',
    level: 1,
  },
  {
    id: '16',
    repository: '1',
    name: 'Program Structure II',
    description: 'Knowing how to add own code into a template',
    level: 2,
  },
];

const ueberCompetencies = [
  {
    id: '1',
    repository: '1',
    name: 'Commands Usage',
    description: 'Commands to compile and execute own programs, wo/ deeper understanding',
    nestedCompetencies: ['1', '2'],
    nestedUeberCompetencies: [],
  },
  {
    id: '2',
    repository: '1',
    name: 'Commands Understanding',
    description: 'Commands to compile and execute own programs, wo/ deeper understanding',
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

const loRepositories = [
  {
    id: '1',
    name: 'Java Course',
    description: 'Java Self-Learning Course',
    userId: '1',
  },
  {
    id: '2',
    name: '2nd Repository',
    description: 'Another repository for upcoming courses',
    userId: '1',
  },
];

const learningObjectives = [
  // Java Chapter 1
  {
    id: '1',
    repositoryId: '1',
    name: 'Introduction',
    description: 'Motivation & Hello-World Example',
    requiredCompetencies: [],
    requiredUeberCompetencies: [],
    offeredCompetencies: ['15'],
    offeredUeberCompetencies: ['1'],
  },
  {
    id: '2',
    repositoryId: '1',
    name: 'Compiler vs. Interpreter',
    description: 'Explanation what javac & java do',
    requiredCompetencies: [],
    requiredUeberCompetencies: ['1'],
    offeredCompetencies: [],
    offeredUeberCompetencies: ['2'],
  },
  {
    id: '3',
    repositoryId: '1',
    name: 'Writing Simple Programs',
    description: 'How to write first programs / program structure',
    requiredCompetencies: ['15'],
    requiredUeberCompetencies: [],
    offeredCompetencies: ['16'],
    offeredUeberCompetencies: [],
  },
  // Java Chapter 2
  {
    id: '4',
    repositoryId: '1',
    name: 'Literals',
    description: 'Constant expressions',
    requiredCompetencies: [],
    requiredUeberCompetencies: ['2'],
    offeredCompetencies: ['5'],
    offeredUeberCompetencies: [],
  },
];

async function seed(): Promise<void> {
  console.log('😅 Seeding...');

  await createUsers();
  console.log('✅ Users');
  await createRepositories();
  console.log('✅ Repositories');
  await createCompetencies();
  console.log('✅ Competencies');
  // wait 1 second to avoid concurrency problems
  await new Promise((f) => setTimeout(f, 1000));
  await createUeberCompetencies();
  console.log('✅ Ueber-Competencies');
  await createLoRepositories();
  console.log('✅ LO-Repositories');
  // wait 1 second to avoid concurrency problems
  await new Promise((f) => setTimeout(f, 1000));
  await createLearningObjectives();
  console.log('✅ Learning Objectives');

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

async function createLoRepositories() {
  const result = <LoRepository[]>[];
  await Promise.all(
    loRepositories.map(async (repository) => {
      const r = await prisma.loRepository.create({
        data: {
          id: repository.id,
          userId: repository.userId,
          name: repository.name,
          description: repository.description,
        },
      });
      result.push(r);
    }),
  );

  return result;
}

async function createLearningObjectives() {
  for (const lo of learningObjectives) {
    const reqCompetencies = lo.requiredCompetencies.map((i) => ({ id: i }));
    const reqUeberCompetencies = lo.requiredUeberCompetencies.map((i) => ({ id: i }));
    const offCompetencies = lo.offeredCompetencies.map((i) => ({ id: i }));
    const offUeberCompetencies = lo.offeredUeberCompetencies.map((i) => ({ id: i }));

    const createdLo = await prisma.learningObject.create({
      data: {
        id: lo.id,
        loRepositoryId: lo.repositoryId,
        name: lo.name,
        description: lo.description,
        requiredCompetencies: {
          connect: reqCompetencies,
        },
        requiredUeberCompetencies: {
          connect: reqUeberCompetencies,
        },
        offeredCompetencies: {
          connect: offCompetencies,
        },
        offeredUeberCompetencies: {
          connect: offUeberCompetencies,
        },
      },
    });
  }
}
