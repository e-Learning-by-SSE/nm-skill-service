import { DbTestUtils } from '../DbTestUtils';
import { SkillMgmtService } from './skill.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SkillRepositoryDto, SkillRepositoryListDto } from './dto';

describe('LearningPath Service', () => {
  // Auxillary objects
  const config = new ConfigService();
  const db = new PrismaService(config);
  const dbUtils = DbTestUtils.getInstance();

  // Test object
  const skillService = new SkillMgmtService(db);

  beforeEach(async () => {
    // Wipe DB before test
    await dbUtils.wipeDb();
  });

  describe('listRepositories', () => {
    it('Empty DB -> Empty ResultList', async () => {
      // Precondition: No Skill-Maps defined
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 0 });

      // Test: Empty result list
      await expect(skillService.listRepositories('anyID')).resolves.toEqual({ repositories: [] });
    });

    it('Query for not existing ID -> Empty ResultList', async () => {
      // Precondition: Some Skill-Maps defined
      const user = await dbUtils.createUser('1', 'A name', 'mail@example.com', 'pw');
      await db.skillMap.create({
        data: {
          name: 'Test',
          owner: { connect: { id: user.id } },
        },
      });
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 1 });

      // Test: Empty result list
      await expect(skillService.listRepositories('anyID')).resolves.toEqual({ repositories: [] });
    });

    it('Query for existing ID -> ResultList with exact match', async () => {
      // Precondition: Some Skill-Maps defined
      const user1 = await dbUtils.createUser('1', 'First name', 'mail1@example.com', 'pw');
      const user2 = await dbUtils.createUser('2', 'Second name', 'mail2@example.com', 'pw');
      const firstCreationResult = await db.skillMap.create({
        data: {
          name: 'Test',
          owner: { connect: { id: user1.id } },
        },
      });
      await db.skillMap.create({
        data: {
          name: 'Test2',
          owner: { connect: { id: user2.id } },
        },
      });
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 2 });

      // Test: ResultList should contain DTO representation of first element
      const expectedResult: Partial<SkillRepositoryDto> = {
        id: firstCreationResult.id,
        name: firstCreationResult.name,
        ownerId: user1.id,
      };
      const expectedList: SkillRepositoryListDto = {
        repositories: [expect.objectContaining(expectedResult)],
      };
      await expect(skillService.listRepositories(user1.id)).resolves.toMatchObject(expectedList);
    });
  });
});
