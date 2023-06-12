import { ConfigService } from '@nestjs/config';

import { PrismaService } from './prisma/prisma.service';
import { PathGoal, Prisma, Skill, SkillMap } from '@prisma/client';

/**
 * Not a test suite, but functionality that supports writing test cases.
 * Simplifies operations on the database during tests.
 */
export class DbTestUtils {
  private static _instance: DbTestUtils;
  private db: PrismaService;

  private constructor() {
    const config = new ConfigService();
    this.db = new PrismaService(config);
  }

  public static getInstance(): DbTestUtils {
    if (!DbTestUtils._instance) {
      DbTestUtils._instance = new DbTestUtils();
    }
    return DbTestUtils._instance;
  }

  public async wipeDb() {
    // Learning Paths
    await this.db.learningPath.deleteMany();

    // Learning Units
    await this.db.learningUnit.deleteMany();
    await this.db.nugget.deleteMany();

    // Skills
    await this.db.skill.deleteMany();
    await this.db.skillMap.deleteMany();
  }

  async createSkill(skillMap: SkillMap, name: string, parentSkills?: string[], description?: string, level?: number) {
    return this.db.skill.create({
      data: {
        repositoryId: skillMap.id,
        name: name,
        level: level ?? 1,
        description: description,
        parentSkills: {
          connect: parentSkills?.map((id) => ({ id: id })),
        },
      },
    });
  }

  async createSkillMap(ownerId: string, name: string, description?: string) {
    return this.db.skillMap.create({
      data: {
        owner: ownerId,
        name: name,
        description: description,
      },
    });
  }

  async createLearningUnit(
    title: string,
    goals: Skill[],
    requirements: Skill[],
    infos:
      | Prisma.SearchLearningUnitUncheckedCreateWithoutBasicUnitInput
      | Prisma.SelfLearningUnitUncheckedCreateWithoutBasicUnitInput,
    description?: string,
  ) {
    const createInput: Prisma.LearningUnitCreateArgs = {
      data: {
        title: title,
        description: description ?? '',
        language: 'en',
        teachingGoals: {
          connect: goals.map((goal) => ({ id: goal.id })),
        },
        requirements: {
          connect: requirements.map((req) => ({ id: req.id })),
        },
      },
    };

    if (infos satisfies Prisma.SelfLearningUnitUncheckedCreateWithoutBasicUnitInput || Object.keys(infos).length === 0) {
      createInput.data.selfLearnInfos = {
        create: infos as Prisma.SelfLearningUnitUncheckedCreateWithoutBasicUnitInput,
      };
    }
    if (infos satisfies Prisma.SearchLearningUnitUncheckedCreateWithoutBasicUnitInput || Object.keys(infos).length === 0) {
      createInput.data.searchInfos = {
        create: infos as Prisma.SearchLearningUnitUncheckedCreateWithoutBasicUnitInput,
      };
    } 
    if (!(infos satisfies Prisma.SelfLearningUnitUncheckedCreateWithoutBasicUnitInput)
        && !(infos satisfies Prisma.SearchLearningUnitUncheckedCreateWithoutBasicUnitInput)) {
      fail('No project-specific extension provided');
    }

    return this.db.learningUnit.create(createInput);
  }

  async createPathGoal(title: string, goals: Skill[], requirements: Skill[], description?: string) {
    return this.db.pathGoal.create({
      data: {
        title: title,
        description: description,
        pathTeachingGoals: {
          connect: goals,
        },
        requirements: {
          connect: requirements,
        },
      },
    });
  }

  async createPath(title: string, pathGoal: PathGoal, description?: string) {
    return this.db.learningPath.create({
      data: {
        title: title,
        description: description,
        goals: {
          connect: pathGoal,
        },
      },
    });
  }

  private objToJson(obj: any) {
    // Order properties to make comparison more reliable
    return (
      JSON.stringify(obj, Object.keys(obj).sort())
        // Try to improve readability
        .replaceAll('{"', '{')
        .replaceAll('":', ':')
        .replaceAll(',"', ',')
        .replaceAll('"', "'")
    );
  }

  /**
   * Auxillary function that compares an actual returned DTO object with an expected DTO object based on their JSON representations.
   * @param actual The received/returned DTO response object.
   * @param expected The expected DTO response object.
   */
  assert(actual: any, expected: any) {
    const actualJson = this.objToJson(actual);
    const expectedJson = this.objToJson(expected);
    expect(actualJson).toEqual(expectedJson);
  }

  assertObjects(actual: object, expected: object) {
    expect(actual).toMatchObject(expected);
  }
}
