import { ConfigService } from '@nestjs/config';
import { DbTestUtils } from '../DbTestUtils';
import { PrismaService } from '../prisma/prisma.service';
import { LearningPathMgmtService } from './learningPath.service';

describe('LearningPath Service', () => {
  // Test object
  let learningPathService: LearningPathMgmtService;

  let db: PrismaService;
  const dbUtils = DbTestUtils.getInstance();

  // Auxillary
  let config: ConfigService;

  beforeAll(async () => {
    config = new ConfigService();
    db = new PrismaService(config);
  });

  beforeEach(async () => {
    // Wipe DB before test
    await dbUtils.wipeDb();
  });

  describe('loadAllLearningPaths', () => {
    it('Empty DB -> Empty Result List', async () => {
      learningPathService = new LearningPathMgmtService(db);
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
      learningPathService = new LearningPathMgmtService(db);
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
      learningPathService = new LearningPathMgmtService(db);
      await expect(
        learningPathService.loadAllLearningPaths({ where: { title: creationResult1.title } }),
      ).resolves.toMatchObject({
        learningPaths: [expect.objectContaining({ title: creationResult1.title })],
      });
    });
  });
});
