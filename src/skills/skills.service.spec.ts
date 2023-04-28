import { DbTestUtils } from '../DbTestUtils';
import { SkillMgmtService } from './skill.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ResolvedSkillRepositoryDto, SkillDto, SkillRepositoryDto, SkillRepositoryListDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { SkillMap, User } from '@prisma/client';

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

  describe('getSkill', () => {
    let defaultUser: User;
    let defaultSkillMap: SkillMap;

    beforeEach(async () => {
      defaultUser = await dbUtils.createUser('1', 'A name', 'mail@example.com', 'pw');
      defaultSkillMap = await dbUtils.createSkillMap('1', 'Test', defaultUser.id);
    });

    it('Non existing ID -> NotFoundException', async () => {
      // Precondition: No Skill-Maps defined
      await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 0 });

      // Test: NotFoundException
      await expect(skillService.getSkill('anyID')).rejects.toThrowError(NotFoundException);
    });

    it('Existing ID -> DTO representation', async () => {
      // Precondition: One skill exists
      const skill = await dbUtils.createSkill(defaultSkillMap, 'Skill 1');
      await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 1 });

      // Test: Load skill
      // Expected result: DTO representation of skill, without parent and nested skills
      const expectedResult: Partial<SkillDto> = {
        id: skill.id,
        name: skill.name,
        level: skill.level,
        description: skill.description ?? undefined,
        nestedSkills: [],
      };
      await expect(skillService.getSkill(skill.id)).resolves.toMatchObject(expectedResult);
    });

    it('One nested Skill', async () => {
      // Precondition: One skill exists
      const skill1 = await dbUtils.createSkill(defaultSkillMap, 'Skill 1');
      const skill2 = await dbUtils.createSkill(defaultSkillMap, 'Skill 2', [skill1.id]);
      await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 2 });

      // Test: Load skill
      // Expected result: DTO representation of skill, without parent and nested skills
      const expectedChild: Partial<SkillDto> = {
        id: skill2.id,
        name: skill2.name,
        level: skill2.level,
        description: skill2.description ?? undefined,
        nestedSkills: [],
      };
      const expectedParent: Partial<SkillDto> = {
        id: skill1.id,
        name: skill1.name,
        level: skill1.level,
        description: skill1.description ?? undefined,
        nestedSkills: [expect.objectContaining(expectedChild)],
      };
      await expect(skillService.getSkill(skill1.id)).resolves.toMatchObject(expectedParent);
    });

    it('Skill multiple times nested', async () => {
      // Precondition: One skill exists
      const skill1 = await dbUtils.createSkill(defaultSkillMap, 'Skill 1');
      const skill2 = await dbUtils.createSkill(defaultSkillMap, 'Skill 2', [skill1.id]);
      const skill3 = await dbUtils.createSkill(
        defaultSkillMap,
        'Skill 3',
        [skill1.id, skill2.id],
        'This skill is nested below Skill 1 AND Skill 2',
      );
      await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

      // Test: Load skill
      // Expected result: DTO representation of skill, without parent and nested skills
      const expectedSkill3: Partial<SkillDto> = {
        id: skill3.id,
        name: skill3.name,
        level: skill3.level,
        description: skill3.description ?? undefined,
        nestedSkills: [],
      };
      const expectedChild: Partial<SkillDto> = {
        id: skill2.id,
        name: skill2.name,
        level: skill2.level,
        description: skill2.description ?? undefined,
        nestedSkills: [expect.objectContaining(expectedSkill3)],
      };
      const expectedParent: Partial<SkillDto> = {
        id: skill1.id,
        name: skill1.name,
        level: skill1.level,
        description: skill1.description ?? undefined,
        nestedSkills: [expect.objectContaining(expectedChild), expect.objectContaining(expectedSkill3)],
      };
      await expect(skillService.getSkill(skill1.id)).resolves.toMatchObject(expectedParent);
    });
  });

  // describe('loadResolvedSkillRepository', () => {
  //   let defaultUser: User;
  //   let defaultSkillMap: SkillMap;

  //   beforeEach(async () => {
  //     defaultUser = await dbUtils.createUser('1', 'A name', 'mail@example.com', 'pw');
  //     defaultSkillMap = await dbUtils.createSkillMap('1', 'Test', defaultUser.id);
  //   });

  // it('2 Top-Level Skills + Multiple Nested', async () => {
  //   // Precondition: One skill exists
  //   const skill1 = await dbUtils.createSkill(defaultSkillMap, 'Skill 1');
  //   const skill2 = await dbUtils.createSkill(defaultSkillMap, 'Skill 2', [skill1.id]);
  //   const skill3 = await dbUtils.createSkill(
  //     defaultSkillMap,
  //     'Skill 3',
  //     [skill1.id, skill2.id],
  //     'This skill is nested below Skill 1 AND Skill 2',
  //   );
  //   const skill4 = await dbUtils.createSkill(defaultSkillMap, 'Skill 4');
  //   await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 4 });

  //   // Test: Load skill
  //   // Expected result: DTO representation of skill, without parent and nested skills
  //   const expectedSkill3: Partial<SkillDto> = {
  //     id: skill3.id,
  //     name: skill3.name,
  //     level: skill3.level,
  //     description: skill3.description ?? undefined,
  //     nestedSkills: [],
  //   };
  //   const expectedSkill2: Partial<SkillDto> = {
  //     id: skill2.id,
  //     name: skill2.name,
  //     level: skill2.level,
  //     description: skill2.description ?? undefined,
  //     nestedSkills: [expect.objectContaining(expectedSkill3)],
  //   };
  //   const expectedSkill1: Partial<SkillDto> = {
  //     id: skill1.id,
  //     name: skill1.name,
  //     level: skill1.level,
  //     description: skill1.description ?? undefined,
  //     nestedSkills: [expect.objectContaining(expectedSkill2), expect.objectContaining(expectedSkill3)],
  //   };
  //   const expectedSkill4: Partial<SkillDto> = {
  //     id: skill4.id,
  //     name: skill4.name,
  //     level: skill4.level,
  //     description: skill1.description ?? undefined,
  //     nestedSkills: [],
  //   };
  //   const expectedSkillMap: Partial<ResolvedSkillRepositoryDto> = {
  //     id: defaultSkillMap.id,
  //     name: defaultSkillMap.name,
  //     skills: [expect.objectContaining(expectedSkill1), expect.objectContaining(expectedSkill4)],
  //   };
  //   await expect(skillService.loadResolvedSkillRepository(defaultUser.id, defaultSkillMap.id)).resolves.toMatchObject(
  //     expectedSkillMap,
  //   );
  // });
  // });
});
