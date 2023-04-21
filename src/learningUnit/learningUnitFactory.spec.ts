import { ConfigService } from '@nestjs/config';

import { DbTestUtils } from '../DbTestUtils';
import { PrismaService } from '../prisma/prisma.service';
import { MODE } from '../env.validation';
import { LearningUnitFactory } from './learningUnitFactory';
import { TestConfig } from '../TestConfig';

describe('LearningUnit Factory', () => {
  // Test object
  let factory: LearningUnitFactory;

  let db: PrismaService;
  let dbUtils: DbTestUtils;

  // Auxillary
  let config: ConfigService;

  beforeAll(async () => {
    config = new ConfigService();
    db = new PrismaService(config);
    dbUtils = DbTestUtils.getInstance();
  });

  describe('SEARCH', () => {
    let testConfig: TestConfig;

    beforeAll(async () => {
      testConfig = new TestConfig(config);
      testConfig.set('EXTENSION', MODE.SEARCH);
    });

    beforeEach(async () => {
      // Wipe DB before test
      await dbUtils.wipeDb();

      factory = new LearningUnitFactory(db, testConfig);
    });

    describe('Find Learning Units', () => {
      it('Empty DB -> Empty Result List', async () => {
        await expect(factory.loadAllLearningUnits()).resolves.toEqual({ learningUnits: [] });
      });
    });
  });

  describe('Self-Learn', () => {
    let testConfig: TestConfig;

    beforeAll(async () => {
      testConfig = new TestConfig(config);
      testConfig.set('EXTENSION', MODE.SELFLEARN);
    });

    beforeEach(async () => {
      // Wipe DB before test
      await dbUtils.wipeDb();

      factory = new LearningUnitFactory(db, testConfig);
    });

    describe('Find Learning Units', () => {
      it('Empty DB -> Empty Result List', async () => {
        await expect(factory.loadAllLearningUnits()).resolves.toEqual({ learningUnits: [] });
      });
    });
  });
});
