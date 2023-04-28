import * as argon from 'argon2';

import { ConfigService } from '@nestjs/config';

import { computeRelationUpdate } from './db_utils';
import { PrismaService } from './prisma/prisma.service';

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

    // Learning Objects
    await this.db.learningGoal.deleteMany();
    await this.db.groupedLearningObjects.deleteMany();
    await this.db.learningObject.deleteMany();
    await this.db.loRepository.deleteMany();

    // Competencies
    await this.db.ueberCompetence.deleteMany();
    await this.db.competence.deleteMany();
    await this.db.repository.deleteMany();

    // Users
    await this.db.user.deleteMany();
  }

  /**
   * Creates a new user.
   */
  public async createUser(id: string, name: string, email: string, pw: string) {
    // Isn't required to be the exact hash function, which is also used in production code
    const hash = await argon.hash(pw);

    const user = await this.db.user.create({
      data: {
        id: id,
        name: name,
        email: email,
        pw: hash,
      },
    });

    return user;
  }

  /**
   * Creates a new repository for an existing user.
   */
  async createRepository(userId: string, repoName: string, version?: string, description?: string, taxonomy?: string) {
    const repository = await this.db.repository.create({
      data: {
        userId: userId,
        name: repoName,
        version: version,
        description: description,
        taxonomy: taxonomy,
      },
    });

    return repository;
  }

  /**
   * Creates a new competence for an existing repository
   */
  async createCompetence(repoId: string, skill: string, level: number, description?: string) {
    const competence = await this.db.competence.create({
      data: {
        repositoryId: repoId,
        skill: skill,
        level: level,
        description: description,
      },
    });

    return competence;
  }

  /**
   * Creates a new competence for an existing repository
   */
  async createUeberCompetence(repoId: string, name: string, description?: string) {
    const ueberCompetence = await this.db.ueberCompetence.create({
      data: {
        repositoryId: repoId,
        name: name,
        description: description,
      },
    });

    return ueberCompetence;
  }

  async createLoRepository(userId: string, name: string, description?: string) {
    return await this.db.loRepository.create({
      data: {
        userId: userId,
        name: name,
        description: description,
      },
    });
  }

  async createLearningObject(
    repositoryId: string,
    name: string,
    description?: string,
    requiredCompetencies?: string[],
    requiredUeberCompetencies?: string[],
    offeredCompetencies?: string[],
    offeredUeberCompetencies?: string[],
  ) {
    let lo = await this.db.learningObject.create({
      data: {
        loRepositoryId: repositoryId,
        name: name,
        description: description,
      },
    });

    if (requiredCompetencies || requiredUeberCompetencies || offeredUeberCompetencies || offeredUeberCompetencies) {
      const changeData: any = {};
      let changedRelations = computeRelationUpdate([], requiredCompetencies);
      if (changedRelations) {
        changeData['requiredCompetencies'] = changedRelations;
      }
      changedRelations = computeRelationUpdate([], requiredUeberCompetencies);
      if (changedRelations) {
        changeData['requiredUeberCompetencies'] = changedRelations;
      }
      changedRelations = computeRelationUpdate([], offeredCompetencies);
      if (changedRelations) {
        changeData['offeredCompetencies'] = changedRelations;
      }
      changedRelations = computeRelationUpdate([], offeredUeberCompetencies);
      if (changedRelations) {
        changeData['offeredUeberCompetencies'] = changedRelations;
      }

      lo = await this.db.learningObject.update({
        where: {
          id: lo.id,
        },
        data: changeData,
        include: {
          requiredCompetencies: true,
          requiredUeberCompetencies: true,
          offeredCompetencies: true,
          offeredUeberCompetencies: true,
        },
      });
    }

    return lo;
  }
}
