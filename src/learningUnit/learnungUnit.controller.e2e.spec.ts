import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { validate } from 'class-validator';
import { DbTestUtils } from '../DbTestUtils';
import { MODE } from '../config/env.validation';
import { PrismaModule } from '../prisma/prisma.module';
import { LearningUnitModule } from './learningUnit.module';
import { LearningUnit, Skill, SkillMap } from '@prisma/client';
import { TestConfig } from '../config/TestConfig';
import { SearchLearningUnitDto, SearchLearningUnitListDto } from './dto';

describe('LearningUnit Controller Tests', () => {
  let app: INestApplication;
  const dbUtils = DbTestUtils.getInstance();

  // Test data
  let skillMap1: SkillMap;
  let skill1: Skill, skill2: Skill, skill3: Skill, nestedSkill1: Skill;

  let lu1: LearningUnit, lu2: LearningUnit, lu3: LearningUnit;

  /**
   * Initializes (relevant parts of) the application before the first test.
   */
  beforeAll(async () => {
    // LearningUnit Factory reads Extension property from Config service, this must be overwritten for testing
    const testConfig = new TestConfig(new ConfigService());
    testConfig.set('EXTENSION', MODE.SEARCH);

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, validate, validationOptions: { allowUnknown: false } }),
        PrismaModule,
        LearningUnitModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(testConfig)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    // Wipe DB before test
    await dbUtils.wipeDb();

    skillMap1 = await dbUtils.createSkillMap('User 1', 'Test Map for LearningUnit Controller Tests');
    skill1 = await dbUtils.createSkill(skillMap1, 'Skill 1');
    nestedSkill1 = await dbUtils.createSkill(skillMap1, 'Nested Skill 1', [skill1.id]);
    skill2 = await dbUtils.createSkill(skillMap1, 'Skill 2');
    skill3 = await dbUtils.createSkill(skillMap1, 'Skill 3');

    // One requirement, one goal: Skill2 -> Skill1
    lu1 = await dbUtils.createLearningUnit('Learning Unit 1', [skill1], [skill2]);
    // Multiple goals, no requirements: {} -> Skill1, Skill2, Skill3
    lu2 = await dbUtils.createLearningUnit('Learning Unit 2', [skill1, skill2, skill3], []);
    // Nested is required by goal: NestedSkill1 -> Skill1
    lu3 = await dbUtils.createLearningUnit('Learning Unit 3', [skill1], [nestedSkill1]);
  });

  describe('GET:learningUnitId', () => {
    it('Get existing Learning Unit', async () => {
      // Expected result
      const expectedResult: SearchLearningUnitDto = {
        language: expect.any(String),
        searchId: lu1.id,
        title: lu1.title,
        teachingGoals: [skill1.id],
        requiredSkills: [skill2.id],
        resource: expect.any(String),
      };

      // Test: Search Learning Unit by ID
      return request(app.getHttpServer())
        .get(`/learningUnits/${lu1.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body as SearchLearningUnitDto).toMatchObject(expectedResult);
        });
    });
  });

  describe('showAllLearningPaths', () => {
    it('Show all Learning Paths', async () => {
      // Expected result
      const expectedResult: SearchLearningUnitListDto = {
        learningUnits: [
          {
            language: expect.any(String),
            searchId: lu1.id,
            title: lu1.title,
            teachingGoals: [skill1.id],
            requiredSkills: [skill2.id],
            resource: expect.any(String),
          },
          {
            language: expect.any(String),
            searchId: lu2.id,
            title: lu2.title,
            teachingGoals: expect.arrayContaining([skill1.id, skill2.id, skill3.id]),
            requiredSkills: [],
            resource: expect.any(String),
          },
          {
            language: expect.any(String),
            searchId: lu3.id,
            title: lu3.title,
            teachingGoals: [skill1.id],
            requiredSkills: [nestedSkill1.id],
            resource: expect.any(String),
          },
        ],
      };

      // Test: Search for Skill Maps of not existing user
      return request(app.getHttpServer())
        .get('/learningUnits/showAllLearningUnits')
        .expect(200)
        .expect((res) => {
          expect(res.body as SearchLearningUnitListDto).toMatchObject(expectedResult);
        });
    });
  });
});
