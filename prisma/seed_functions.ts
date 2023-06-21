import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

type LearningUnitType = {
  id: number;
  name: string;
  description: string;
  requirements: string[];
  teachingGoals: string[];
  searchInfos?: Prisma.SearchLearningUnitUncheckedCreateNestedOneWithoutBasicUnitInput;
  selflearnInfos?: Prisma.SelfLearningUnitUncheckedCreateNestedOneWithoutBasicUnitInput;
}[];

export async function createLearningObjects(learningObjectives: LearningUnitType) {
  // Avoid Deadlocks -> Run all in sequence
  for (const unit of learningObjectives) {
    await prisma.learningUnit.create({
      data: {
        id: unit.id,
        resource: faker.internet.url(),
        title: unit.name,
        language: 'de',
        description: unit.description,
        requirements: {
          connect: unit.requirements.map((i) => ({ id: i })),
        },
        teachingGoals: {
          connect: unit.teachingGoals.map((i) => ({ id: i })),
        },
        selfLearnInfos: {
          create: {
            // Ensure that selfLearnInfos exist in demo seed
            order: 1,
            ...unit.selflearnInfos,
          },
        },
        searchInfos: {
          create: {
            // Ensure that searchInfos exist in demo seed
            rating: '1',
            ...unit.searchInfos,
          },
        },
      },
    });
  }
}
