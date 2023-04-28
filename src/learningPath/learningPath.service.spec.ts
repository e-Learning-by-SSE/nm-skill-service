import { ConfigService } from '@nestjs/config';
import { DbTestUtils } from '../DbTestUtils';
import { PrismaService } from '../prisma/prisma.service';
import { LearningPathMgmtService } from './learningPath.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { LearningPathCreationDto, LearningPathDto, PathGoalCreationDto, PathGoalDto } from './dto';

describe('LearningPath Service', () => {
  // Auxillary objects
  const config = new ConfigService();
  const db = new PrismaService(config);
  const dbUtils = DbTestUtils.getInstance();

  // Test object
  const learningPathService = new LearningPathMgmtService(db);

  beforeEach(async () => {
    // Wipe DB before test
    await dbUtils.wipeDb();
  });

  describe('loadAllLearningPaths', () => {
    it('Empty DB -> Empty Result List', async () => {
      await expect(learningPathService.loadAllLearningPaths()).resolves.toEqual({ learningPaths: [] });
    });

    it('One Path definition -> One result', async () => {
      // Precondition: 1 element exist (do not rely on Service for its creation)
      const creationResult = await db.learningPath.create({
        data: {
          title: 'Test',
        },
      });

      // Test: Exactly one element with specified title found
      await expect(learningPathService.loadAllLearningPaths()).resolves.toMatchObject({
        learningPaths: [expect.objectContaining({ title: creationResult.title })],
      });
    });

    it('Select by Title -> Not all elements returned', async () => {
      // Precondition: 2 elements exist (do not rely on Service for its creation)
      const creationResult1 = await db.learningPath.create({
        data: {
          title: 'Test',
        },
      });
      await db.learningPath.create({
        data: {
          title: 'Test2',
        },
      });

      // Test: Only first element found
      await expect(
        learningPathService.loadAllLearningPaths({ where: { title: creationResult1.title } }),
      ).resolves.toMatchObject({
        learningPaths: [expect.objectContaining({ title: creationResult1.title })],
      });
    });
  });

  describe('getLearningPath', () => {
    it('Empty DB -> Error', async () => {
      await expect(learningPathService.getLearningPath('anyID')).rejects.toThrow(NotFoundException);
    });

    it('ID of existing element -> Specified element retrieved', async () => {
      // Precondition: 1 element exist (do not rely on Service for its creation)
      const creationResult = await db.learningPath.create({
        data: {
          title: 'Test',
        },
      });

      const expectedResult: Partial<LearningPathDto> = {
        id: creationResult.id,
        title: creationResult.title,
      };
      await expect(learningPathService.getLearningPath(creationResult.id)).resolves.toMatchObject(
        expect.objectContaining(expectedResult),
      );
    });

    it('Wrong ID -> Error', async () => {
      // Precondition: 1 element exist (do not rely on Service for its creation)
      const creationResult = await db.learningPath.create({
        data: {
          title: 'Test',
        },
      });

      await expect(learningPathService.getLearningPath(creationResult.id + '_wrongID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createLearningPath', () => {
    it('Create empty Path on empty DB-> LearningPath created', async () => {
      // Data to be created
      const creationDto: LearningPathCreationDto = {
        title: 'Test',
        goals: [],
      };

      // Pre-Condition: Expected element does not exist
      await expect(
        learningPathService.loadAllLearningPaths({ where: { title: creationDto.title } }),
      ).resolves.toMatchObject({
        learningPaths: [],
      });

      // Post-Condition: Element was created and DTO is returned
      const expected: Partial<LearningPathDto> = {
        id: expect.anything(),
        title: creationDto.title,
        goals: [],
      };
      await expect(learningPathService.createLearningPath(creationDto)).resolves.toMatchObject(
        expect.objectContaining(expected),
      );
    });

    it('Duplicate Title -> Error', async () => {
      // Data to be created
      const creationDto: LearningPathCreationDto = {
        title: 'Test',
        goals: [],
      };

      // Pre-Condition: Element with specified title already exists
      await db.learningPath.create({
        data: {
          title: creationDto.title,
        },
      });

      // Post-Condition: No element created -> Error thrown
      await expect(learningPathService.createLearningPath(creationDto)).rejects.toThrow(ForbiddenException);
    });
  });

  it('Create Path including a Goal-Spec -> LearningPath created', async () => {
    // Data to be created
    const goal1 = new PathGoalCreationDto('Test Goal', null, 'Test Description', [], []);

    const creationDto: LearningPathCreationDto = {
      title: 'Test',
      goals: [goal1],
    };

    // Pre-Condition: Expected element does not exist
    await expect(
      learningPathService.loadAllLearningPaths({ where: { title: creationDto.title } }),
    ).resolves.toMatchObject({
      learningPaths: [],
    });

    // Post-Condition: Element was created and DTO is returned
    const expectedGoal: Partial<PathGoalDto> = {
      title: goal1.title,
      description: goal1.description,
    };
    const expected: Partial<LearningPathDto> = {
      id: expect.anything(),
      title: creationDto.title,
      goals: [expect.objectContaining(expectedGoal)],
    };
    await expect(learningPathService.createLearningPath(creationDto)).resolves.toMatchObject(expected);
  });
});
