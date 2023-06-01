import { ConfigService } from '@nestjs/config';

import { DbTestUtils } from '../DbTestUtils';
import { PrismaService } from '../prisma/prisma.service';
import { MODE } from '../config/env.validation';
import { LearningUnitFactory } from './learningUnitFactory';
import { TestConfig } from '../config/TestConfig';
import {
  SearchLearningUnitCreationDto,
  SearchLearningUnitDto,
  SearchLearningUnitListDto,
  SelfLearnLearningUnitCreationDto,
  SelfLearnLearningUnitDto,
  SelfLearnLearningUnitListDto,
} from './dto';

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

    describe('loadAllLearningUnits', () => {
      it('Empty DB -> Empty Result List', async () => {
        await expect(factory.loadAllLearningUnits()).resolves.toEqual({ learningUnits: [] });
      });

      it('With Parameter on Empty DB -> Empty Result List', async () => {
        await expect(factory.loadAllLearningUnits({ where: { title: 'Awesome Title' } })).resolves.toEqual({
          learningUnits: [],
        });
      });

      it('With Parameter -> Only exact match should return', async () => {
        const creationDtoMatch = SearchLearningUnitCreationDto.createForTesting({ title: 'Awesome Title' });
        const creationDtoNoMatch = SearchLearningUnitCreationDto.createForTesting({ title: 'Awesome Title 2' });
        await factory.createLearningUnit(creationDtoMatch);
        await factory.createLearningUnit(creationDtoNoMatch);

        // Should return only the first object
        const result = await factory.loadAllLearningUnits({ where: { title: 'Awesome Title' } });

        // Expected DTO class and values for one and only element
        const expectedItem: Partial<SearchLearningUnitDto> = {
          title: creationDtoMatch.title,
          requiredSkills: [],
          teachingGoals: [],
        };
        // Expected DTO class and values for the whole list
        const expectedList: SearchLearningUnitListDto = {
          learningUnits: [expect.objectContaining(expectedItem)],
        };
        expect(result).toMatchObject(expectedList);
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

    describe('loadAllLearningUnits', () => {
      it('Empty DB -> Empty Result List', async () => {
        await expect(factory.loadAllLearningUnits()).resolves.toEqual({ learningUnits: [] });
      });

      it('With Parameter on Empty DB -> Empty Result List', async () => {
        await expect(factory.loadAllLearningUnits({ where: { title: 'Awesome Title' } })).resolves.toEqual({
          learningUnits: [],
        });
      });

      it('With Parameter -> Only exact match should return', async () => {
        const creationDtoMatch = SelfLearnLearningUnitCreationDto.createForTesting({ title: 'Awesome Title' });
        const creationDtoNoMatch = SelfLearnLearningUnitCreationDto.createForTesting({ title: 'Awesome Title 2' });
        await factory.createLearningUnit(creationDtoMatch);
        await factory.createLearningUnit(creationDtoNoMatch);

        // Should return only the first object
        const result = await factory.loadAllLearningUnits({ where: { title: 'Awesome Title' } });

        // Expected DTO class and values for one and only element
        const expectedItem: Partial<SelfLearnLearningUnitDto> = {
          title: creationDtoMatch.title,
          requiredSkills: [],
          teachingGoals: [],
        };
        // Expected DTO class and values for the whole list
        const expectedList: SelfLearnLearningUnitListDto = {
          learningUnits: [expect.objectContaining(expectedItem)],
        };
        expect(result).toMatchObject(expectedList);
      });
    });
  });
});
