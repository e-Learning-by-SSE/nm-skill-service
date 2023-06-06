import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SkillModule } from './skill.module';
import { DbTestUtils } from '../DbTestUtils';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from 'class-validator';
import { SkillRepositoryListDto } from './dto';

describe('Skill Controler Tests', () => {
  let app: INestApplication;
  const dbUtils = DbTestUtils.getInstance();

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
    await dbUtils.createSkillMap('User-1', 'Awesome Test Map', '1.0.0');
  });

  describe('/skill-repositories', () => {
    it('Skill Maps of not existing user -> Empty list', () => {
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
  });
});
