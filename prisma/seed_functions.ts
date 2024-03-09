import { LIFECYCLE, Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

type LearningUnitType = {
  id: string;
  parent: string[];
  name: string;
  description: string;
  requirements: string[];
  teachingGoals: string[];
  lifecycle: LIFECYCLE; 
  orga_id: string;

}[];

export async function createLearningObjects(learningObjectives: LearningUnitType) {
  // Avoid Deadlocks -> Run all in sequence
  for (const unit of learningObjectives) {

    const parent = unit.parent?.map((i) => ({ id: i }));

    await prisma.learningUnit.create({
      data: {
        id: unit.id,
        parent: {
            connect: parent,
        },
        lifecycle: unit.lifecycle,
        orga_id: unit.orga_id,
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
