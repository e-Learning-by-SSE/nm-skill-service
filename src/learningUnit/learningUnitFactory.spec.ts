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
import { Skill, SkillMap } from '@prisma/client';

describe('LearningUnit Factory', () => {
  // Test object
  let factory: LearningUnitFactory;

  let db: PrismaService;
  let dbUtils: DbTestUtils;

  // Auxillary
  let config: ConfigService;

  // Test data
  let skillMap: SkillMap;
  let reqSkill: Skill;
  let goalSkill: Skill;

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

      // Create Skills that may be used during tests
      skillMap = await dbUtils.createSkillMap('owner', 'Default Skill Map for Testing');
      reqSkill = await dbUtils.createSkill(skillMap, 'Required Skill', [], 'Description', 1);
      goalSkill = await dbUtils.createSkill(skillMap, 'Taught Skill', [], 'Description', 1);
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

    describe('createLearningUnit', () => {
      it('Empty DB, no Skills -> Create Learning Unit', async () => {
        const creationDto = SearchLearningUnitCreationDto.createForTesting({ title: 'Awesome Title' });
        const result = await factory.createLearningUnit(creationDto);

        // Expected DTO class and values
        const expected: Partial<SearchLearningUnitDto> = {
          title: creationDto.title,
          requiredSkills: [],
          teachingGoals: [],
        };
        expect(result).toMatchObject(expected);
        // Test that it is actually a SearchLearningUnitDto, by testing for the existence of search-specific mandatory properties
        expect(result).toHaveProperty('searchId');
      });

      it('Empty DB, Required Skill -> Create Learning Unit', async () => {
        const creationDto = SearchLearningUnitCreationDto.createForTesting({
          title: 'Awesome Title',
          requiredSkills: [reqSkill.id],
        });
        const result = await factory.createLearningUnit(creationDto);

        // Expected DTO class and values
        const expected: Partial<SearchLearningUnitDto> = {
          title: creationDto.title,
          requiredSkills: creationDto.requiredSkills,
          teachingGoals: [],
        };
        expect(result).toMatchObject(expected);
        // Test that it is actually a SearchLearningUnitDto, by testing for the existence of search-specific mandatory properties
        expect(result).toHaveProperty('searchId');
      });

      it('Empty DB, Taught Skill -> Create Learning Unit', async () => {
        const creationDto = SearchLearningUnitCreationDto.createForTesting({
          title: 'Awesome Title',
          requiredSkills: [reqSkill.id],
          teachingGoals: [goalSkill.id],
        });
        const result = await factory.createLearningUnit(creationDto);

        // Expected DTO class and values
        const expected: Partial<SearchLearningUnitDto> = {
          title: creationDto.title,
          requiredSkills: creationDto.requiredSkills,
          teachingGoals: creationDto.teachingGoals,
        };
        expect(result).toMatchObject(expected);
        // Test that it is actually a SearchLearningUnitDto, by testing for the existence of search-specific mandatory properties
        expect(result).toHaveProperty('searchId');
      });

      it('Empty DB, Required/Taught Skills -> Create Learning Unit', async () => {
        const creationDto = SearchLearningUnitCreationDto.createForTesting({
          title: 'Awesome Title',
          teachingGoals: [goalSkill.id],
        });
        const result = await factory.createLearningUnit(creationDto);

        // Expected DTO class and values
        const expected: Partial<SearchLearningUnitDto> = {
          title: creationDto.title,
          requiredSkills: [],
          teachingGoals: creationDto.teachingGoals,
        };
        expect(result).toMatchObject(expected);
        // Test that it is actually a SearchLearningUnitDto, by testing for the existence of search-specific mandatory properties
        expect(result).toHaveProperty('searchId');
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

      // Create Skills that may be used during tests
      skillMap = await dbUtils.createSkillMap('owner', 'Default Skill Map for Testing');
      reqSkill = await dbUtils.createSkill(skillMap, 'Required Skill', [], 'Description', 1);
      goalSkill = await dbUtils.createSkill(skillMap, 'Taught Skill', [], 'Description', 1);
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
 
          teachingGoals: [],
        };
        // Expected DTO class and values for the whole list
        const expectedList: SelfLearnLearningUnitListDto = {
          learningUnits: [expect.objectContaining(expectedItem)],
        };
        expect(result).toMatchObject(expectedList);
      });
    });

    describe('createLearningUnit', () => {
      it('Empty DB, no Skills -> Create Learning Unit', async () => {
        const creationDto = SelfLearnLearningUnitCreationDto.createForTesting({ title: 'Awesome Title' });
        const result = await factory.createLearningUnit(creationDto);

        // Expected DTO class and values
        const expected: Partial<SelfLearnLearningUnitDto> = {
          title: creationDto.title,
          requiredSkills: [],
          teachingGoals: [],
        };
        expect(result).toMatchObject(expected);
        // Test that it is actually a SelfLearnLearningUnitDto, by testing for the existence of selflearn-specific mandatory properties
        expect(result).toHaveProperty('selfLearnId');
      });

      it('Empty DB, Required Skill -> Create Learning Unit', async () => {
        const creationDto = SelfLearnLearningUnitCreationDto.createForTesting({
          title: 'Awesome Title',
          requiredSkills: [reqSkill.id],
        });
        const result = await factory.createLearningUnit(creationDto);

        // Expected DTO class and values
        const expected: Partial<SelfLearnLearningUnitDto> = {
          title: creationDto.title,
          requiredSkills: creationDto.requiredSkills,
          teachingGoals: [],
        };
        expect(result).toMatchObject(expected);
        // Test that it is actually a SelfLearnLearningUnitDto, by testing for the existence of selflearn-specific mandatory properties
        expect(result).toHaveProperty('selfLearnId');
      });

      it('Empty DB, Taught Skill -> Create Learning Unit', async () => {
        const creationDto = SelfLearnLearningUnitCreationDto.createForTesting({
          title: 'Awesome Title',
          requiredSkills: [reqSkill.id],
          teachingGoals: [goalSkill.id],
        });
        const result = await factory.createLearningUnit(creationDto);

        // Expected DTO class and values
        const expected: Partial<SelfLearnLearningUnitDto> = {
          title: creationDto.title,
          requiredSkills: creationDto.requiredSkills,
          teachingGoals: creationDto.teachingGoals,
        };
        expect(result).toMatchObject(expected);
        // Test that it is actually a SelfLearnLearningUnitDto, by testing for the existence of selflearn-specific mandatory properties
        expect(result).toHaveProperty('selfLearnId');
      });

      it('Empty DB, Required/Taught Skills -> Create Learning Unit', async () => {
        const creationDto = SelfLearnLearningUnitCreationDto.createForTesting({
          title: 'Awesome Title',
          teachingGoals: [goalSkill.id],
        });
        const result = await factory.createLearningUnit(creationDto);

        // Expected DTO class and values
        const expected: Partial<SelfLearnLearningUnitDto> = {
          title: creationDto.title,
          requiredSkills: [],
          teachingGoals: creationDto.teachingGoals,
        };
        expect(result).toMatchObject(expected);
        // Test that it is actually a SelfLearnLearningUnitDto, by testing for the existence of selflearn-specific mandatory properties
        expect(result).toHaveProperty('selfLearnId');
      });
    });
  });  
});
