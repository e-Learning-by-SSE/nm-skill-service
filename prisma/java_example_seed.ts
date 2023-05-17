import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const repository = {
  id: '1',
  user: '1',
  name: 'Java OO Repository',
  description: 'Example to demonstrate competence modelling capabilities',
  taxonomy: 'Bloom',
  version: 'v1',
};

const skills = [
  {
    id: '1',
    name: 'Compiler Calling',
    description: 'Calling javac, wo/ knowing what it exactly does',
    level: 1,
  },
  {
    id: '2',
    name: 'Interpreter Calling',
    description: 'Calling java, wo/ knowing what it exactly does',
    level: 1,
  },
  {
    id: '3',
    name: 'Compiler Usage',
    description: 'Knowing how & why to use javac',
    level: 3,
  },
  {
    id: '4',
    name: 'Interpreter Usage',
    description: 'Knowing how & why to use java',
    level: 3,
  },
  {
    id: '5',
    name: 'Literals',
    description: 'Constant expressions',
    level: 3,
  },
  {
    id: '6',
    name: 'Primitive Datatypes & Operators',
    description: '',
    level: 3,
  },
  {
    id: '7',
    name: 'Variables',
    description: 'Variable Usage in Expressions',
    level: 3,
  },
  {
    id: '9',
    name: 'if-statement',
    description: 'if wo/ else',
    level: 3,
  },
  {
    id: '10',
    name: 'else-statement',
    description: 'else-statement',
    level: 3,
  },
  {
    id: '11',
    name: 'if-block',
    description: 'Using curly brackets to nest more than 1 statement',
    level: 3,
  },
  {
    id: '12',
    name: 'if nesting',
    description: 'Nest multiple if-statements',
    level: 3,
  },
  {
    id: '13',
    name: 'switch/case basics',
    description: 'switch, case, break, default',
    level: 3,
  },
  {
    id: '14',
    name: 'switch/case advanced',
    description: 'falls through, expressions, strings',
    level: 3,
  },
  {
    id: '15',
    name: 'Program Structure I',
    description: 'Knowing how to add own code into a template',
    level: 1,
  },
  {
    id: '16',
    name: 'Program Structure II',
    description: 'Knowing how to add own code into a template',
    level: 2,
  },
  {
    id: '17',
    name: 'Casting Primitive Datatypes',
    description: '',
    level: 3,
  },
  {
    id: '18',
    name: 'What are Expressions',
    description: '',
    level: 1,
  },
  {
    id: '19',
    name: 'Constants',
    description: 'final, static',
    level: 3,
  },
  {
    id: '20',
    name: 'Input',
    description: 'User input via Scanner',
    level: 3,
  },
  {
    id: '21',
    name: 'Writing Import',
    description: 'Writing Import statements wo/ knowing the background',
    level: 1,
  },
  {
    id: '22',
    name: 'Math.random',
    description: 'Using Math.random',
    level: 2,
  },
  {
    id: '23',
    name: 'Code Block I',
    description: 'More than one statement wo/scope',
    level: 3,
  },
  {
    id: '24',
    name: 'Code Block II',
    description: 'With scope',
    level: 3,
  },
  {
    id: '25',
    name: 'Foundations of Loops',
    description: 'Explains general use of Loops',
    level: 2,
  },
  {
    id: '26',
    name: 'For-Loop',
    description: 'For-Loop',
    level: 3,
  },
  {
    id: '27',
    name: 'While-Loop',
    description: 'While-Loop',
    level: 3,
  },
  {
    id: '28',
    name: 'Do-While-Loop',
    description: 'Do-While-Loop',
    level: 3,
  },
];

const skillGroups = [
  {
    id: '1001',
    level: 1,
    name: 'Commands Usage',
    description: 'Commands to compile and execute own programs, wo/ deeper understanding',
    nested: ['1', '2'],
  },
  {
    id: '1002',
    level: 3,
    name: 'Commands Understanding',
    description: 'Commands to compile and execute own programs, wo/ deeper understanding',
    nested: ['3', '4'],
  },
  {
    id: '1003',
    level: 3,
    name: 'Expressions',
    description: 'Complete understanding of expressions in Java',
    nested: ['5', '6', '7', '18'],
  },
  {
    id: '1004',
    level: 3,
    name: 'if/else concept',
    description: 'Complete understanding of if/else in Java',
    nestedCompetencies: ['9', '10', '11', '12', '1003'],
  },
  {
    id: '1005',
    level: 3,
    name: 'switch/case concept',
    description: 'Complete understanding of switch/case in Java',
    nestedCompetencies: ['13', '14', '23', '1003'],
  },
  {
    id: '1006',
    level: 3,
    name: 'Branching',
    description: 'if/else and switch/case',
    nested: ['1004', '1005'],
  },
  {
    id: '1007',
    level: 3,
    name: 'Code Blocks',
    description: '',
    nested: ['11', '23', '24'],
  },
  {
    id: '1008',
    level: 3,
    name: 'Imperative Loops',
    description: '',
    nested: ['25', '26', '27', '28'],
  },
  {
    id: '1009',
    level: 3,
    name: 'Control Structures',
    description: 'if, switch case, loops',
    nested: ['1006', '1008'],
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
    id: 1,
    name: 'Introduction',
    description: 'Motivation & Hello-World Example',
    requirements: [],
    teachingGoals: ['15', '1001'],
  },
  {
    id: 2,
    name: 'Compiler vs. Interpreter',
    description: 'Explanation what javac & java do',
    requirements: ['1001'],
    teachingGoals: ['1002'],
  },
  {
    id: 3,
    name: 'Writing Simple Programs',
    description: 'How to write first programs / program structure',
    requirements: ['15'],
    teachingGoals: ['16'],
  },
  // Java Chapter 2
  {
    id: 4,
    name: 'Literals',
    description: 'Constant expressions',
    requirements: ['16', '1002'],
    teachingGoals: ['18'],
  },
  {
    id: 5,
    name: 'Basic Datatypes, Literals, Casts',
    description: 'Constant expressions',
    requirements: ['16', '18', '1002'],
    teachingGoals: ['5', '6', '17'],
  },
  {
    id: 6,
    name: 'Variables / Constants',
    description: 'Variable Expressions',
    requirements: ['1002'],
    teachingGoals: ['7', '19'],
  },
  {
    id: 7,
    name: 'Input w/ Scanner',
    description: 'Using Scanner for user input',
    requirements: ['6', '7', '16', '1002'],
    teachingGoals: ['20', '21'],
  },
  {
    id: 8,
    name: 'if statement',
    description: 'Using Scanner for user input',
    requirements: ['16', '20', '1002', '1003'],
    teachingGoals: ['9'],
  },
  {
    id: 9,
    name: 'if/else statements',
    description: 'Using Scanner for user input',
    requirements: ['9', '16', '20', '1002', '1003'],
    teachingGoals: ['10'],
  },
  {
    id: 10,
    name: 'if/else statements (advanced)',
    description: 'Using Scanner for user input',
    requirements: ['9', '10', '16', '20', '1002', '1003'],
    teachingGoals: ['11', '12'],
  },
  {
    id: 11,
    name: 'Random numbers',
    description: 'Random numbers using Math.random',
    requirements: ['6', '7', '16', '1002', '1003'],
    teachingGoals: ['22'],
  },
  {
    id: 12,
    name: 'switch/case',
    description: 'switch case as alternative to if/else',
    requirements: ['16', '20', '1002', '1003', '1004'],
    teachingGoals: ['13', '14'],
  },
  {
    id: 13,
    name: 'Code-Blocks',
    description: 'Allowing more than 1 statement & scope',
    requirements: ['16', '1002'],
    teachingGoals: ['23', '24'],
  },
  {
    id: 14,
    name: 'Introduction of Loops',
    description: 'Introduction of Loops',
    requirements: ['16', '1002', '1006'],
    teachingGoals: ['25'],
  },
  {
    id: 15,
    name: 'For-Loop',
    description: 'For-Loop',
    requirements: ['16', '25', '1002', '1006'],
    teachingGoals: ['26'],
  },
  {
    id: 16,
    name: 'While-Loop',
    description: 'While-Loop',
    requirements: ['16', '25', '1002', '1006'],
    teachingGoals: ['27'],
  },
  {
    id: 17,
    name: 'Do-While-Loop',
    description: 'Do-While-Loop',
    requirements: ['16', '25', '1002', '1006'],
    teachingGoals: ['28'],
  },
];

const learningGoals = [
  {
    id: '1',
    repositoryId: '1',
    name: 'Imperative Programming with Java',
    description: 'Writing algorithms with Java, without OO',
    goals: ['1009'],
  },
];

export async function javaSeed(): Promise<void> {
  await createRepositories();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Repositories');
  await createCompetencies();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Skills');
  await createSkillGroups();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'SkillGroups');
  await createLearningObjects();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Learning Objects');
  await createGoals();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Goals');
}

async function createRepositories() {
  await prisma.skillMap.create({
    data: {
      id: repository.id,
      owner: repository.user,
      name: repository.name,
      description: repository.description,
      taxonomy: repository.taxonomy,
      version: repository.version,
    },
  });
}

async function createCompetencies() {
  await Promise.all(
    skills.map(async (competence) => {
      const input: Prisma.SkillUncheckedCreateInput = { repositoryId: repository.id, ...competence };

      await prisma.skill.create({
        data: input,
      });
    }),
  );
}

async function createSkillGroups() {
  // Need to preserve ordering and wait to be finished before creating the next one!
  for (const skill of skillGroups) {
    const nested = skill.nested?.map((i) => ({ id: i }));

    await prisma.skill.create({
      data: {
        id: skill.id,
        repositoryId: repository.id,
        name: skill.name,
        description: skill.description,
        level: skill.level,
        nestedSkills: {
          connect: nested,
        },
      },
    });
  }
}

async function createLearningObjects() {
  // Avoid Deadlocks -> Run all in sequence
  for (const unit of learningObjectives) {
    await prisma.learningUnit.create({
      data: {
        id: unit.id,
        title: unit.name,
        language: 'de',
        description: unit.description,
        requirements: {
          connect: unit.requirements.map((i) => ({ id: i })),
        },
        teachingGoals: {
          connect: unit.teachingGoals.map((i) => ({ id: i })),
        },
      },
    });
  }
}

async function createGoals() {
  // Avoid Deadlocks -> Run all in sequence
  for (const goal of learningGoals) {
    learningGoals.map(async (goal) => {
      await prisma.pathGoal.create({
        data: {
          id: goal.id,
          title: goal.name,
          description: goal.description,
          pathTeachingGoals: {
            connect: goal.goals.map((i) => ({ id: i })),
          },
        },
      });
    });
  }
}
