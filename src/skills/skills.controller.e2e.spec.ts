import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SkillModule } from './skill.module';
import { DbTestUtils } from '../DbTestUtils';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from 'class-validator';
import { SkillRepositoryDto, SkillRepositoryListDto } from './dto';
import { SkillMap } from '@prisma/client';

describe('Skill Controler Tests', () => {
  let app: INestApplication;
  const dbUtils = DbTestUtils.getInstance();

  // Test data
  let skillMap1: SkillMap;
  let skillMap2: SkillMap;

  /**
   * Initializes (relevant parts of) the application before each test.
   */
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, validate, validationOptions: { allowUnknown: false } }),
        PrismaModule,
        SkillModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    // Wipe DB before test
    await dbUtils.wipeDb();

    // Create test data
    skillMap1 = await dbUtils.createSkillMap('User-1', 'Awesome Test Map');
    skillMap2 = await dbUtils.createSkillMap('User-1', 'Test Map 2');
    await dbUtils.createSkillMap('User-2', 'Map of another user');
  });

  describe('/skill-repositories', () => {
    it('Skill Maps of not existing user -> Empty list', () => {
      // Expected result
      const expectedObject: SkillRepositoryListDto = {
        repositories: [],
      };
      const expected: string = JSON.stringify(expectedObject);

      return request(app.getHttpServer())
        .get('/skill-repositories/not-existing-owner-id')
        .expect(200)
        .expect((res) => {
          expect(JSON.stringify(res.body)).toEqual(expected);
        });
    });

    it('Skill Maps of existing user -> Skill Maps of that user', () => {
      // Expected result
      const expectedObject: SkillRepositoryListDto = {
        repositories: [SkillRepositoryDto.createFromDao(skillMap1), SkillRepositoryDto.createFromDao(skillMap2)],
      };
      const expected: string = JSON.stringify(expectedObject);

      return request(app.getHttpServer())
        .get(`/skill-repositories/${skillMap1.owner}`)
        .expect(200)
        .expect((res) => {
          expect(JSON.stringify(res.body)).toEqual(expected);
        });
    });
  });
});
