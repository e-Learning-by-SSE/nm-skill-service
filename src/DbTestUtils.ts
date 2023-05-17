import { ConfigService } from '@nestjs/config';

import { PrismaService } from './prisma/prisma.service';
import { SkillMap } from '@prisma/client';

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
}
