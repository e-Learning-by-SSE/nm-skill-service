import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, Res } from '@nestjs/common';
import { SkillModule } from './skill.module';
import { DbTestUtils } from '../DbTestUtils';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from 'class-validator';
import {
  ResolvedSkillDto,
  ResolvedSkillRepositoryDto,
  SkillDto,
  SkillListDto,
  SkillRepositoryDto,
  SkillRepositoryListDto,
  SkillRepositorySearchDto,
  SkillSearchDto,
} from './dto';
import { Skill, SkillMap } from '@prisma/client';
import { UnresolvedSkillRepositoryDto } from './dto/unresolved-skill-repository.dto';

describe('Skill Controller Tests', () => {
  let app: INestApplication;
  const dbUtils = DbTestUtils.getInstance();

  // Test data
  let skillMap1: SkillMap;
  let skillMap2: SkillMap;
  let skillMap3: SkillMap;
  let skillMapWithSkills: SkillMap;
  let skill2: Skill;
  let skill3: Skill;
  let nestedSkill1: Skill;

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
    skillMap3 = await dbUtils.createSkillMap('User-2', 'Another awesome map by a different user');
    skillMapWithSkills = await dbUtils.createSkillMap('User-3', 'A skill map with skills');
    await dbUtils.createSkill(skillMap3, 'Item of Map 3');
    skill2 = await dbUtils.createSkill(skillMapWithSkills, 'Awesome Skill');
    skill3 = await dbUtils.createSkill(skillMapWithSkills, 'Another Skill');
    nestedSkill1 = await dbUtils.createSkill(skillMapWithSkills, 'Nested Skill', [skill2.id]);
  });

  describe('/skill-repositories', () => {
    it('Search for Skill Maps of not existing user -> Empty list', () => {
      // Search DTO
      const input: SkillRepositorySearchDto = {
        owner: 'not-existing-owner-id',
      };

      // Expected result
      const emptyList: SkillRepositoryListDto = {
        repositories: [],
      };

      // Test: Search for Skill Maps of not existing user
      return request(app.getHttpServer())
        .post('/skill-repositories')
        .send(input)
        .expect(201)
        .expect((res) => {
          dbUtils.assert(res.body, emptyList);
        });
    });

    it('All repositories of one user', () => {
      // Search DTO
      const input: SkillRepositorySearchDto = {
        owner: skillMap1.owner,
      };

      // Expected result
      const emptyList: SkillRepositoryListDto = {
        repositories: [SkillRepositoryDto.createFromDao(skillMap1), SkillRepositoryDto.createFromDao(skillMap2)],
      };

      // Test: Search for Skill Maps of User-1
      return request(app.getHttpServer())
        .post('/skill-repositories')
        .send(input)
        .expect(201)
        .expect((res) => {
          dbUtils.assert(res.body, emptyList);
        });
    });

    it('By contained name', () => {
      // Search DTO
      const input: SkillRepositorySearchDto = {
        name: 'awesome',
      };

      // Expected result
      const emptyList: SkillRepositoryListDto = {
        repositories: [SkillRepositoryDto.createFromDao(skillMap1), SkillRepositoryDto.createFromDao(skillMap3)],
      };

      // Test: Search for Skill Maps of User-1
      return request(app.getHttpServer())
        .post('/skill-repositories')
        .send(input)
        .expect(201)
        .expect((res) => {
          dbUtils.assert(res.body, emptyList);
        });
    });
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

  describe('/byId', () => {
    it('Skill Map by ID', () => {
      // Expected result
      const expectedObject: UnresolvedSkillRepositoryDto = {
        ...SkillRepositoryDto.createFromDao(skillMap1),
        skills: [],
      };

      return request(app.getHttpServer())
        .get(`/skill-repositories/byId/${skillMap1.id}`)
        .expect(200)
        .expect((res) => {
          dbUtils.assert(res.body, expectedObject);
        });
    });

    it('Skill Map by ID with Skills', () => {
      // Expected result
      const expectedObject: UnresolvedSkillRepositoryDto = {
        ...SkillRepositoryDto.createFromDao(skillMapWithSkills),
        skills: [skill2.id, skill3.id, nestedSkill1.id],
      };

      return request(app.getHttpServer())
        .get(`/skill-repositories/byId/${skillMapWithSkills.id}`)
        .expect(200)
        .expect((res) => {
          dbUtils.assert(res.body, expectedObject);
        });
    });
  });

  describe('/findSkills', () => {
    it('Search for Skills of not existing Skill Map -> Empty list', () => {
      // Search DTO
      const input: SkillSearchDto = {
        skillMap: 'not-existing-map-id',
      };

      // Expected result
      const emptyList: SkillListDto = {
        skills: [],
      };

      // Test: Search for Skills
      return request(app.getHttpServer())
        .post('/skill-repositories/findSkills')
        .send(input)
        .expect(201)
        .expect((res) => {
          dbUtils.assert(res.body, emptyList);
        });
    });

    it('Search for Skills by Name', () => {
      // Search DTO
      const input: SkillSearchDto = {
        name: 'Skill',
      };

      // Expected result: All skills with name '*Skill*'
      const resultList: SkillListDto = {
        skills: [
          {
            ...SkillDto.createFromDao(skill2),
            nestedSkills: [nestedSkill1.id],
          },
          SkillDto.createFromDao(skill3),
          SkillDto.createFromDao(nestedSkill1),
        ],
      };

      // Test: Search for Skills
      return request(app.getHttpServer())
        .post('/skill-repositories/findSkills')
        .send(input)
        .expect(201)
        .expect((res) => {
          dbUtils.assert(res.body, resultList);
        });
    });
  });

  describe('/resolve/:repositoryId', () => {
    it('Resolve Skill Map with Skills & Nested Skill', () => {
      // Expected result
      const expectedObject = ResolvedSkillRepositoryDto.createFromDao(skillMapWithSkills);
      expectedObject.skills = [
        { ...ResolvedSkillDto.createFromDao(skill2), nestedSkills: [ResolvedSkillDto.createFromDao(nestedSkill1)] },
        ResolvedSkillDto.createFromDao(skill3),
      ];

      // Test: Resolve Skill Map
      return request(app.getHttpServer())
        .get(`/skill-repositories/resolve/${skillMapWithSkills.id}`)
        .expect(200)
        .expect((res) => {
          dbUtils.assert(res.body, expectedObject);
        });
    });
  });
});
