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
  });
});
