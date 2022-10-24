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
  {
    id: '17',
    repository: '1',
    name: 'Casting Primitive Datatypes',
    description: '',
    level: 3,
  },
  {
    id: '18',
    repository: '1',
    name: 'What are Expressions',
    description: '',
    level: 1,
  },
  {
    id: '19',
    repository: '1',
    name: 'Constants',
    description: 'final, static',
    level: 3,
  },
  {
    id: '20',
    repository: '1',
    name: 'Input',
    description: 'User input via Scanner',
    level: 3,
  },
  {
    id: '21',
    repository: '1',
    name: 'Writing Import',
    description: 'Writing Import statements wo/ knowing the background',
    level: 1,
  },
  {
    id: '22',
    repository: '1',
    name: 'Math.random',
    description: 'Using Math.random',
    level: 2,
  },
  {
    id: '23',
    repository: '1',
    name: 'Code Block I',
    description: 'More than one statement wo/scope',
    level: 3,
  },
  {
    id: '24',
    repository: '1',
    name: 'Code Block II',
    description: 'With scope',
    level: 3,
  },
  {
    id: '25',
    repository: '1',
    name: 'Foundations of Loops',
    description: 'Explains general use of Loops',
    level: 2,
  },
  {
    id: '26',
    repository: '1',
    name: 'For-Loop',
    description: 'For-Loop',
    level: 3,
  },
  {
    id: '27',
    repository: '1',
    name: 'While-Loop',
    description: 'While-Loop',
    level: 3,
  },
  {
    id: '28',
    repository: '1',
    name: 'Do-While-Loop',
    description: 'Do-While-Loop',
    level: 3,
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
    nestedCompetencies: ['5', '6', '7', '18'],
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
    nestedCompetencies: ['13', '14', '23'],
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
  {
    id: '7',
    repository: '1',
    name: 'Code Blocks',
    description: '',
    nestedCompetencies: ['11', '23', '24'],
    nestedUeberCompetencies: [],
  },
  {
    id: '8',
    repository: '1',
    name: 'Imperative Loops',
    description: '',
    nestedCompetencies: ['25', '26', '27', '28'],
    nestedUeberCompetencies: [],
  },
  {
    id: '9',
    repository: '1',
    name: 'Control Structures',
    description: 'if, switch case, loops',
    nestedCompetencies: [],
    nestedUeberCompetencies: ['6', '8'],
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
    name: 'SE I',
    description: 'Foundations on Software Engineering',
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
    requiredCompetencies: ['16'],
    requiredUeberCompetencies: ['2'],
    offeredCompetencies: ['18'],
    offeredUeberCompetencies: [],
  },
  {
    id: '5',
    repositoryId: '1',
    name: 'Basic Datatypes, Literals, Casts',
    description: 'Constant expressions',
    requiredCompetencies: ['16', '18'],
    requiredUeberCompetencies: ['2'],
    offeredCompetencies: ['5', '6', '17'],
    offeredUeberCompetencies: [],
  },
  {
    id: '6',
    repositoryId: '1',
    name: 'Variables / Constants',
    description: 'Variable Expressions',
    requiredCompetencies: [],
    requiredUeberCompetencies: ['2'],
    offeredCompetencies: ['7', '19'],
    offeredUeberCompetencies: [],
  },
  {
    id: '7',
    repositoryId: '1',
    name: 'Input w/ Scanner',
    description: 'Using Scanner for user input',
    requiredCompetencies: ['16', '6', '7'],
    requiredUeberCompetencies: ['2'],
    offeredCompetencies: ['20', '21'],
    offeredUeberCompetencies: [],
  },
  {
    id: '8',
    repositoryId: '1',
    name: 'if statement',
    description: 'Using Scanner for user input',
    requiredCompetencies: ['16', '20'],
    requiredUeberCompetencies: ['2', '3'],
    offeredCompetencies: ['9'],
    offeredUeberCompetencies: [],
  },
  {
    id: '9',
    repositoryId: '1',
    name: 'if/else statements',
    description: 'Using Scanner for user input',
    requiredCompetencies: ['9', '16', '20'],
    requiredUeberCompetencies: ['2', '3'],
    offeredCompetencies: ['10'],
    offeredUeberCompetencies: [],
  },
  {
    id: '10',
    repositoryId: '1',
    name: 'if/else statements (advanced)',
    description: 'Using Scanner for user input',
    requiredCompetencies: ['9', '10', '16', '20'],
    requiredUeberCompetencies: ['2', '3'],
    offeredCompetencies: ['11', '12'],
    offeredUeberCompetencies: [],
  },
  {
    id: '11',
    repositoryId: '1',
    name: 'Random numbers',
    description: 'Random numbers using Math.random',
    requiredCompetencies: ['6', '7', '16'],
    requiredUeberCompetencies: ['2', '3'],
    offeredCompetencies: ['22'],
    offeredUeberCompetencies: [],
  },
  {
    id: '12',
    repositoryId: '1',
    name: 'switch/case',
    description: 'switch case as alternative to if/else',
    requiredCompetencies: ['16', '20'],
    requiredUeberCompetencies: ['2', '3', '4'],
    offeredCompetencies: ['13', '14'],
    offeredUeberCompetencies: [],
  },
  {
    id: '13',
    repositoryId: '1',
    name: 'Code-Blocks',
    description: 'Allowing more than 1 statement & scope',
    requiredCompetencies: ['16'],
    requiredUeberCompetencies: ['2', '3'],
    offeredCompetencies: ['6'],
    offeredUeberCompetencies: ['5'],
  },
  {
    id: '14',
    repositoryId: '1',
    name: 'Introduction of Loops',
    description: 'Introduction of Loops',
    requiredCompetencies: ['16'],
    requiredUeberCompetencies: ['2', '6'],
    offeredCompetencies: ['25'],
    offeredUeberCompetencies: [],
  },
  {
    id: '15',
    repositoryId: '1',
    name: 'For-Loop',
    description: 'For-Loop',
    requiredCompetencies: ['16', '25'],
    requiredUeberCompetencies: ['2', '6'],
    offeredCompetencies: ['26'],
    offeredUeberCompetencies: [],
  },
  {
    id: '16',
    repositoryId: '1',
    name: 'While-Loop',
    description: 'While-Loop',
    requiredCompetencies: ['16', '25'],
    requiredUeberCompetencies: ['2', '6'],
    offeredCompetencies: ['27'],
    offeredUeberCompetencies: [],
  },
  {
    id: '17',
    repositoryId: '1',
    name: 'Do-While-Loop',
    description: 'Do-While-Loop',
    requiredCompetencies: ['16', '25'],
    requiredUeberCompetencies: ['2', '6'],
    offeredCompetencies: ['27'],
    offeredUeberCompetencies: [],
  },
];

const learningGoals = [
  {
    id: '1',
    repositoryId: '1',
    name: 'Imperative Programming with Java',
    description: 'Writing algorithms with Java, without OO',
    lowLevelGoals: [],
    highLevelGoals: ['9'],
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
  await createLearningObjects();
  console.log('✅ Learning Objects');
  await createGoals();
  console.log('✅ Goals');

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

async function createLearningObjects() {
  await Promise.all(
    learningObjectives.map(async (lo) => {
      const reqCompetencies = lo.requiredCompetencies.map((i) => ({ id: i }));
      const reqUeberCompetencies = lo.requiredUeberCompetencies.map((i) => ({ id: i }));
      const offCompetencies = lo.offeredCompetencies.map((i) => ({ id: i }));
      const offUeberCompetencies = lo.offeredUeberCompetencies.map((i) => ({ id: i }));

      await prisma.learningObject.create({
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
    }),
  );
}

async function createGoals() {
  await Promise.all(
    learningGoals.map(async (goal) => {
      const lowLevel = goal.lowLevelGoals.map((i) => ({ id: i }));
      const highLevel = goal.highLevelGoals.map((i) => ({ id: i }));

      await prisma.learningGoal.create({
        data: {
          id: goal.id,
          loRepositoryId: goal.repositoryId,
          name: goal.name,
          description: goal.description,
          lowLevelGoals: {
            connect: lowLevel,
          },
          highLevelGoals: {
            connect: highLevel,
          },
        },
      });
    }),
  );
}
