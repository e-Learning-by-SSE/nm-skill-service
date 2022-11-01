import * as argon from 'argon2';

import { LoRepository, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users = [
  {
    email: 'java@sse.de',
    name: 'Java Teacher',
    pw: 'pw',
    id: '1',
  },
];

const repository = {
  id: '1',
  user: '1',
  name: 'Java OO Repository',
  description: 'Example to demonstrate competence modelling capabilities',
  taxonomy: 'Bloom',
  version: 'v1',
};

const competencies = [
  {
    id: '1',
    skill: 'Compiler Calling',
    description: 'Calling javac, wo/ knowing what it exactly does',
    level: 1,
  },
  {
    id: '2',
    skill: 'Interpreter Calling',
    description: 'Calling java, wo/ knowing what it exactly does',
    level: 1,
  },
  {
    id: '3',
    skill: 'Compiler Usage',
    description: 'Knowing how & why to use javac',
    level: 3,
  },
  {
    id: '4',
    skill: 'Interpreter Usage',
    description: 'Knowing how & why to use java',
    level: 3,
  },
  {
    id: '5',
    skill: 'Literals',
    description: 'Constant expressions',
    level: 3,
  },
  {
    id: '6',
    skill: 'Primitive Datatypes & Operators',
    description: '',
    level: 3,
  },
  {
    id: '7',
    skill: 'Variables',
    description: 'Variable Usage in Expressions',
    level: 3,
  },
  {
    id: '9',
    skill: 'if-statement',
    description: 'if wo/ else',
    level: 3,
  },
  {
    id: '10',
    skill: 'else-statement',
    description: 'else-statement',
    level: 3,
  },
  {
    id: '11',
    skill: 'if-block',
    description: 'Using curly brackets to nest more than 1 statement',
    level: 3,
  },
  {
    id: '12',
    skill: 'if nesting',
    description: 'Nest multiple if-statements',
    level: 3,
  },
  {
    id: '13',
    skill: 'switch/case basics',
    description: 'switch, case, break, default',
    level: 3,
  },
  {
    id: '14',
    skill: 'switch/case advanced',
    description: 'falls through, expressions, strings',
    level: 3,
  },
  {
    id: '15',
    skill: 'Program Structure I',
    description: 'Knowing how to add own code into a template',
    level: 1,
  },
  {
    id: '16',
    skill: 'Program Structure II',
    description: 'Knowing how to add own code into a template',
    level: 2,
  },
  {
    id: '17',
    skill: 'Casting Primitive Datatypes',
    description: '',
    level: 3,
  },
  {
    id: '18',
    skill: 'What are Expressions',
    description: '',
    level: 1,
  },
  {
    id: '19',
    skill: 'Constants',
    description: 'final, static',
    level: 3,
  },
  {
    id: '20',
    skill: 'Input',
    description: 'User input via Scanner',
    level: 3,
  },
  {
    id: '21',
    skill: 'Writing Import',
    description: 'Writing Import statements wo/ knowing the background',
    level: 1,
  },
  {
    id: '22',
    skill: 'Math.random',
    description: 'Using Math.random',
    level: 2,
  },
  {
    id: '23',
    skill: 'Code Block I',
    description: 'More than one statement wo/scope',
    level: 3,
  },
  {
    id: '24',
    skill: 'Code Block II',
    description: 'With scope',
    level: 3,
  },
  {
    id: '25',
    skill: 'Foundations of Loops',
    description: 'Explains general use of Loops',
    level: 2,
  },
  {
    id: '26',
    skill: 'For-Loop',
    description: 'For-Loop',
    level: 3,
  },
  {
    id: '27',
    skill: 'While-Loop',
    description: 'While-Loop',
    level: 3,
  },
  {
    id: '28',
    skill: 'Do-While-Loop',
    description: 'Do-While-Loop',
    level: 3,
  },
];

const ueberCompetencies = [
  {
    id: '1',
    name: 'Commands Usage',
    description: 'Commands to compile and execute own programs, wo/ deeper understanding',
    nestedCompetencies: ['1', '2'],
    nestedUeberCompetencies: [],
  },
  {
    id: '2',
    name: 'Commands Understanding',
    description: 'Commands to compile and execute own programs, wo/ deeper understanding',
    nestedCompetencies: ['3', '4'],
    nestedUeberCompetencies: [],
  },
  {
    id: '3',
    name: 'Expressions',
    description: 'Complete understanding of expressions in Java',
    nestedCompetencies: ['5', '6', '7', '18'],
    nestedUeberCompetencies: [],
  },
  {
    id: '4',
    name: 'if/else concept',
    description: 'Complete understanding of if/else in Java',
    nestedCompetencies: ['9', '10', '11', '12'],
    nestedUeberCompetencies: ['3'],
  },
  {
    id: '5',
    name: 'switch/case concept',
    description: 'Complete understanding of switch/case in Java',
    nestedCompetencies: ['13', '14', '23'],
    nestedUeberCompetencies: ['3'],
  },
  {
    id: '6',
    name: 'Branching',
    description: 'if/else and switch/case',
    nestedCompetencies: [],
    nestedUeberCompetencies: ['4', '5'],
  },
  {
    id: '7',
    name: 'Code Blocks',
    description: '',
    nestedCompetencies: ['11', '23', '24'],
    nestedUeberCompetencies: [],
  },
  {
    id: '8',
    name: 'Imperative Loops',
    description: '',
    nestedCompetencies: ['25', '26', '27', '28'],
    nestedUeberCompetencies: [],
  },
  {
    id: '9',
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
    name: 'Introduction',
    description: 'Motivation & Hello-World Example',
    requiredCompetencies: [],
    requiredUeberCompetencies: [],
    offeredCompetencies: ['15'],
    offeredUeberCompetencies: ['1'],
  },
  {
    id: '2',
    name: 'Compiler vs. Interpreter',
    description: 'Explanation what javac & java do',
    requiredCompetencies: [],
    requiredUeberCompetencies: ['1'],
    offeredCompetencies: [],
    offeredUeberCompetencies: ['2'],
  },
  {
    id: '3',
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
    name: 'Literals',
    description: 'Constant expressions',
    requiredCompetencies: ['16'],
    requiredUeberCompetencies: ['2'],
    offeredCompetencies: ['18'],
    offeredUeberCompetencies: [],
  },
  {
    id: '5',
    name: 'Basic Datatypes, Literals, Casts',
    description: 'Constant expressions',
    requiredCompetencies: ['16', '18'],
    requiredUeberCompetencies: ['2'],
    offeredCompetencies: ['5', '6', '17'],
    offeredUeberCompetencies: [],
  },
  {
    id: '6',
    name: 'Variables / Constants',
    description: 'Variable Expressions',
    requiredCompetencies: [],
    requiredUeberCompetencies: ['2'],
    offeredCompetencies: ['7', '19'],
    offeredUeberCompetencies: [],
  },
  {
    id: '7',
    name: 'Input w/ Scanner',
    description: 'Using Scanner for user input',
    requiredCompetencies: ['16', '6', '7'],
    requiredUeberCompetencies: ['2'],
    offeredCompetencies: ['20', '21'],
    offeredUeberCompetencies: [],
  },
  {
    id: '8',
    name: 'if statement',
    description: 'Using Scanner for user input',
    requiredCompetencies: ['16', '20'],
    requiredUeberCompetencies: ['2', '3'],
    offeredCompetencies: ['9'],
    offeredUeberCompetencies: [],
  },
  {
    id: '9',
    name: 'if/else statements',
    description: 'Using Scanner for user input',
    requiredCompetencies: ['9', '16', '20'],
    requiredUeberCompetencies: ['2', '3'],
    offeredCompetencies: ['10'],
    offeredUeberCompetencies: [],
  },
  {
    id: '10',
    name: 'if/else statements (advanced)',
    description: 'Using Scanner for user input',
    requiredCompetencies: ['9', '10', '16', '20'],
    requiredUeberCompetencies: ['2', '3'],
    offeredCompetencies: ['11', '12'],
    offeredUeberCompetencies: [],
  },
  {
    id: '11',
    name: 'Random numbers',
    description: 'Random numbers using Math.random',
    requiredCompetencies: ['6', '7', '16'],
    requiredUeberCompetencies: ['2', '3'],
    offeredCompetencies: ['22'],
    offeredUeberCompetencies: [],
  },
  {
    id: '12',
    name: 'switch/case',
    description: 'switch case as alternative to if/else',
    requiredCompetencies: ['16', '20'],
    requiredUeberCompetencies: ['2', '3', '4'],
    offeredCompetencies: ['13', '14'],
    offeredUeberCompetencies: [],
  },
  {
    id: '13',
    name: 'Code-Blocks',
    description: 'Allowing more than 1 statement & scope',
    requiredCompetencies: ['16'],
    requiredUeberCompetencies: ['2'],
    offeredCompetencies: ['23', '24'],
    offeredUeberCompetencies: [],
  },
  {
    id: '14',
    name: 'Introduction of Loops',
    description: 'Introduction of Loops',
    requiredCompetencies: ['16'],
    requiredUeberCompetencies: ['2', '6'],
    offeredCompetencies: ['25'],
    offeredUeberCompetencies: [],
  },
  {
    id: '15',
    name: 'For-Loop',
    description: 'For-Loop',
    requiredCompetencies: ['16', '25'],
    requiredUeberCompetencies: ['2', '6'],
    offeredCompetencies: ['26'],
    offeredUeberCompetencies: [],
  },
  {
    id: '16',
    name: 'While-Loop',
    description: 'While-Loop',
    requiredCompetencies: ['16', '25'],
    requiredUeberCompetencies: ['2', '6'],
    offeredCompetencies: ['27'],
    offeredUeberCompetencies: [],
  },
  {
    id: '17',
    name: 'Do-While-Loop',
    description: 'Do-While-Loop',
    requiredCompetencies: ['16', '25'],
    requiredUeberCompetencies: ['2', '6'],
    offeredCompetencies: ['28'],
    offeredUeberCompetencies: [],
  },
];

const loGroups = [
  {
    id: '1',
    name: 'Imperative Loops',
    description: 'Loops wo/ for each',
    loRepositoryId: '1',
    nestedLOs: ['14', '15', '16', '17'],
    nestedGroups: [],
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

export async function javaSeed(): Promise<void> {
  await createUsers();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Users');
  await createRepositories();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Repositories');
  await createCompetencies();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Competencies');
  await createUeberCompetencies();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Uber-Competencies');
  await createLoRepositories();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'LO-Repositories');
  await createLearningObjects();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Learning Objects');
  await createLoGroups();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Learning Object Groups');
  await createGoals();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Goals');
}

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
  await prisma.repository.create({
    data: {
      id: repository.id,
      userId: repository.user,
      name: repository.name,
      description: repository.description,
      taxonomy: repository.taxonomy,
      version: repository.version,
    },
  });
}

async function createCompetencies() {
  await Promise.all(
    competencies.map(async (competence) => {
      const input: Prisma.CompetenceUncheckedCreateInput = { repositoryId: repository.id, ...competence };

      await prisma.competence.create({
        data: input,
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
        repositoryId: repository.id,
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
          loRepositoryId: loRepositories[0].id,
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

async function createLoGroups() {
  await Promise.all(
    loGroups.map(async (group) => {
      const nestedLos = group.nestedLOs.map((i) => ({ id: i }));
      const nestedGroups = group.nestedGroups.map((i) => ({ id: i }));

      await prisma.groupedLearningObjects.create({
        data: {
          id: group.id,
          loRepositoryId: group.loRepositoryId,
          name: group.name,
          description: group.description,
          nestedLOs: {
            connect: nestedLos,
          },
          nestedGroups: {
            connect: nestedGroups,
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
