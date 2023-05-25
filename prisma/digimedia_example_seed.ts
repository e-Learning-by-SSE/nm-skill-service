import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const repository = {
  id: '2',
  user: '1',
  name: 'Open DigiMedia',
  description: 'Example created by Luisa',
  taxonomy: 'Bloom',
  version: 'v1',
};

const skills = [
  {
    id: '2001',
    name: 'Geschichte der industriellen Produktion',
    level: 1,
  },
  {
    id: '2002',
    name: 'Definition Industrie 4.0',
    level: 1,
  },
  {
    id: '2003',
    name: 'Einführung Digitale Transformation',
    level: 1,
  },
  {
    id: '2004',
    name: 'Gründe Digitalisierung',
    level: 1,
  },
  {
    id: '2005',
    name: 'Produktionsdigitalisierung',
    level: 1,
  },
  {
    id: '2006',
    name: 'Definition Smart Factory',
    level: 1,
  },
  {
    id: '2007',
    name: 'Definition Daten und Informationen',
    level: 1,
  },
  {
    id: '2008',
    name: 'Daten- und Informationsflüsse im Unternehmen',
    level: 1,
  },
  {
    id: '2009',
    name: 'Technologien der Digitalisierung',
    level: 1,
  },
  {
    id: '2010',
    name: 'Herausforderungen bei der Umsetzung von Digitalisierungsmaßnahmen',
    level: 1,
  },
];

const skillGroups = [
  {
    id: '2101',
    level: 1,
    name: 'Grundlagen Industrie 4.0',
    description: undefined,
    nested: ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010'],
  },
];

const learningObjectives = [
  // Chapter 1
  {
    id: 2001,
    name: 'Wandel der Industrie',
    description:
      'Die Lernenden können zentrale technische Veränderungen in der Industrie geschichtlich einordnen und den Begriff Industrie 4.0 erklären.',
    requirements: [],
    teachingGoals: ['2001', '2002'],
  },
];

const learningGoals = [
  {
    id: '2001',
    repositoryId: '1',
    name: 'Industrie im Wandel der Zeit',
    description: undefined,
    goals: ['2101'],
  },
];

export async function digimediaSeed(): Promise<void> {
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
  }
}
