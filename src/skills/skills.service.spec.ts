import { DbTestUtils } from '../DbTestUtils';
import { SkillMgmtService } from './skill.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import {
  ResolvedSkillRepositoryDto,
  SkillCreationDto,
  SkillDto,
  SkillRepositoryCreationDto,
  SkillRepositoryDto,
  SkillRepositoryListDto,
} from './dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SkillMap, User } from '@prisma/client';

describe('LearningPath Service', () => {
  // Auxillary objects
  const config = new ConfigService();
  const db = new PrismaService(config);
  const dbUtils = DbTestUtils.getInstance();

  // Test object
  const skillService = new SkillMgmtService(db);

  // Default user -> Used in most of the tests
  let defaultUser: User;

  beforeEach(async () => {
    // Wipe DB before test
    await dbUtils.wipeDb();

    // Create first user
    defaultUser = await dbUtils.createUser('1', 'A name', 'mail@example.com', 'pw');
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
      await db.skillMap.create({
        data: {
          name: 'Test',
          owner: { connect: { id: defaultUser.id } },
        },
      });
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 1 });

      // Test: Empty result list
      await expect(skillService.listRepositories('anyID')).resolves.toEqual({ repositories: [] });
    });

    it('Query for existing ID -> ResultList with exact match', async () => {
      // Precondition: Some Skill-Maps defined
      const user2 = await dbUtils.createUser('2', 'Second name', 'mail2@example.com', 'pw');
      const firstCreationResult = await db.skillMap.create({
        data: {
          name: 'Test',
          owner: { connect: { id: defaultUser.id } },
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
        ownerId: defaultUser.id,
      };
      const expectedList: SkillRepositoryListDto = {
        repositories: [expect.objectContaining(expectedResult)],
      };
      await expect(skillService.listRepositories(defaultUser.id)).resolves.toMatchObject(expectedList);
    });
  });

  describe('createRepository', () => {
    it('Create First Repository -> Success', () => {
      // Precondition: No Skill-Maps defined
      expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 0 });

      // Test: Create first repository
      const creationDto: SkillRepositoryCreationDto = {
        name: 'Test',
      };
      const expectation: Partial<SkillRepositoryDto> = {
        name: creationDto.name,
        ownerId: defaultUser.id,
        description: creationDto.description ?? undefined,
      };
      expect(skillService.createRepository(defaultUser.id, creationDto)).resolves.toMatchObject(expectation);
    });
  });

  describe('getSkill', () => {
    let defaultSkillMap: SkillMap;

    beforeEach(async () => {
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

  describe('loadResolvedSkillRepository', () => {
    let defaultSkillMap: SkillMap;

    beforeEach(async () => {
      defaultSkillMap = await dbUtils.createSkillMap(defaultUser.id, 'Test', 'A Description');
    });

    it('2 Top-Level Skills + Multiple Nested', async () => {
      // Precondition: One skill exists
      const skill1 = await dbUtils.createSkill(defaultSkillMap, 'Skill 1');
      const skill2 = await dbUtils.createSkill(defaultSkillMap, 'Skill 2', [skill1.id]);
      const skill3 = await dbUtils.createSkill(
        defaultSkillMap,
        'Skill 3',
        [skill1.id, skill2.id],
        'This skill is nested below Skill 1 AND Skill 2',
      );
      const skill4 = await dbUtils.createSkill(defaultSkillMap, 'Skill 4');
      await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 4 });

      // Test: Load skill
      const result = skillService.loadResolvedSkillRepository(defaultUser.id, defaultSkillMap.id);

      // Expected result: DTO representation of skill, without parent and nested skills
      const expectedSkill3: Partial<SkillDto> = {
        id: skill3.id,
        name: skill3.name,
        level: skill3.level,
        description: skill3.description ?? undefined,
        nestedSkills: [],
      };
      const expectedSkill2: Partial<SkillDto> = {
        id: skill2.id,
        name: skill2.name,
        level: skill2.level,
        description: skill2.description ?? undefined,
        nestedSkills: [expect.objectContaining(expectedSkill3)],
      };
      const expectedSkill1: Partial<SkillDto> = {
        id: skill1.id,
        name: skill1.name,
        level: skill1.level,
        description: skill1.description ?? undefined,
        nestedSkills: [expect.objectContaining(expectedSkill2), expect.objectContaining(expectedSkill3)],
      };
      const expectedSkill4: Partial<SkillDto> = {
        id: skill4.id,
        name: skill4.name,
        level: skill4.level,
        description: skill1.description ?? undefined,
        nestedSkills: [],
      };
      const expectedSkillMap: Partial<ResolvedSkillRepositoryDto> = {
        id: defaultSkillMap.id,
        name: defaultSkillMap.name,
        skills: [expect.objectContaining(expectedSkill1), expect.objectContaining(expectedSkill4)],
      };
      await expect(result).resolves.toMatchObject(expectedSkillMap);
    });
  });

  describe('createSkill', () => {
    let defaultSkillMap: SkillMap;

    beforeEach(async () => {
      defaultSkillMap = await dbUtils.createSkillMap(defaultUser.id, 'Test', 'A Description');
    });

    it('Create on Empty DB -> New DTO', async () => {
      // Precondition: No Skill-Maps defined
      await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 0 });

      // Test: Create skill
      const creationDto: SkillCreationDto = {
        name: 'Skill 1',
        level: 1,
        description: 'A Description',
        parentSkills: [],
        nestedSkills: [],
      };

      // Expected result: DTO representation of skill, without parent and nested skills
      const expectedSkill: Partial<SkillDto> = {
        name: creationDto.name,
        level: creationDto.level,
        description: creationDto.description,
        nestedSkills: [],
      };
      await expect(skillService.createSkill(defaultUser.id, defaultSkillMap.id, creationDto)).resolves.toMatchObject(
        expectedSkill,
      );
    });

    it('Existing Name -> ForbiddenException', async () => {
      // Precondition: One Skill defined
      const firstSkill = await db.skill.create({
        data: {
          name: 'Skill 1',
          level: 1,
          repositoryId: defaultSkillMap.id,
        },
      });
      await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 1 });

      // Test: Create skill
      const creationDto: SkillCreationDto = {
        name: firstSkill.name,
        level: 2,
        description: 'Another Description',
        parentSkills: [],
        nestedSkills: [],
      };

      // Expected result: Exception because of naming conflict
      await expect(skillService.createSkill(defaultUser.id, defaultSkillMap.id, creationDto)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });
});
