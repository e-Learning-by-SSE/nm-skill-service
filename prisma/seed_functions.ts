import { LIFECYCLE, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type LearningUnitType = {
  id: string;
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
    await prisma.learningUnit.create({
      data: {
        id: unit.id,
        lifecycle: unit.lifecycle,
        orga_id: unit.orga_id,
        language: 'de',
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
