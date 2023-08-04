import { DbTestUtils } from '../DbTestUtils';
import { SkillMgmtService } from './skill.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import {
  ResolvedSkillRepositoryDto,
  SkillCreationDto,
  ResolvedSkillDto,
  SkillRepositoryCreationDto,
  SkillRepositoryDto,
  SkillRepositoryListDto,
} from './dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Skill, SkillMap } from '@prisma/client';
import { UnresolvedSkillRepositoryDto } from './dto/unresolved-skill-repository.dto';

describe('Skill Service', () => {
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

  describe('findSkillRepositories', () => {
    it('Empty DB -> Empty ResultList', async () => {
      // Precondition: No Skill-Maps defined
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 0 });

      // Test: Empty result list
      await expect(skillService.findSkillRepositories(null, null, null, null, null)).resolves.toEqual({
        repositories: [],
      });
    });

    it('Query for not existing Owner-ID -> Empty ResultList', async () => {
      // Precondition: Some Skill-Maps defined
      await db.skillMap.create({
        data: {
          name: 'Test',
        
        },
      });
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 1 });

      // Test: Empty result list
      await expect(skillService.findSkillRepositories(null, null, 'User-2', null, null)).resolves.toEqual({
        repositories: [],
      });
    });

    it('Query for existing Owner-ID -> ResultList with exact match', async () => {
      // Precondition: Some Skill-Maps defined
      const firstCreationResult = await db.skillMap.create({
        data: {
          name: 'Test',
         
        },
      });
      await db.skillMap.create({
        data: {
          name: 'Test2',

        },
      });
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 2 });

      // Test: ResultList should contain DTO representation of first element
      const expectedResult: Partial<SkillRepositoryDto> = {
        id: firstCreationResult.id,
        name: firstCreationResult.name,

      };
      const expectedList: SkillRepositoryListDto = {
        repositories: [expect.objectContaining(expectedResult)],
      };
      await expect(skillService.findSkillRepositories(null, null, 'User-1', null, null)).resolves.toMatchObject(
        expectedList,
      );
    });

    it('Query for repository name by StringFilter (Containment) -> ResultList with matches', async () => {
      // Precondition: Some Skill-Maps defined
      const firstCreationResult = await db.skillMap.create({
        data: {
          name: 'Test',
       
        },
      });
      const secondCreationResult = await db.skillMap.create({
        data: {
          name: 'Test 2',
         
        },
      });
      // Should not be found
      await db.skillMap.create({
        data: {
          name: 'A completely different name',
        
        },
      });
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

      // Test: ResultList should contain DTO representation all elements that contain the name "Test"
      const expectedList: SkillRepositoryListDto = {
        repositories: [
          expect.objectContaining({
            id: firstCreationResult.id,
            name: firstCreationResult.name,
       
          }),
          expect.objectContaining({
            id: secondCreationResult.id,
            name: secondCreationResult.name,
        
          }),
        ],
      };
      await expect(
        skillService.findSkillRepositories(null, null, null, { contains: 'Test', mode: 'insensitive' }, null),
      ).resolves.toMatchObject(expectedList);
    });

    it('Test Pagination (Page)', async () => {
      // Precondition: Some Skill-Maps defined
      const skillMap1 = await db.skillMap.create({
        data: {
          name: 'First Map',
        
        },
      });
      const skillMap2 = await db.skillMap.create({
        data: {
          name: 'Second Map',
       
        },
      });
      const skillMap3 = await db.skillMap.create({
        data: {
          name: 'Third Map',
      
        },
      });
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

      // Test: Retrieve all 3 pages (with pagesize 1)
      await expect(skillService.findSkillRepositories(0, 1, null, null, null)).resolves.toMatchObject({
        repositories: [
          expect.objectContaining({
            name: skillMap1.name,
            id: skillMap1.id,
      
          }),
        ],
      });
      await expect(skillService.findSkillRepositories(1, 1, null, null, null)).resolves.toMatchObject({
        repositories: [
          expect.objectContaining({
            name: skillMap2.name,
            id: skillMap2.id,
           
          }),
        ],
      });
      await expect(skillService.findSkillRepositories(2, 1, null, null, null)).resolves.toMatchObject({
        repositories: [
          expect.objectContaining({
            name: skillMap3.name,
            id: skillMap3.id,
            
          }),
        ],
      });
    });
    it('Test Pagination (Pagesize)', async () => {
      // Precondition: Some Skill-Maps defined
      const skillMap1 = await db.skillMap.create({
        data: {
          name: 'First Map',
      
        },
      });
      const skillMap2 = await db.skillMap.create({
        data: {
          name: 'Second Map',
       
        },
      });
      const skillMap3 = await db.skillMap.create({
        data: {
          name: 'Third Map',
         
        },
      });
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

      // Test: Retrieve all 3 pages (with pagesize 2)
      await expect(skillService.findSkillRepositories(0, 2, null, null, null)).resolves.toMatchObject({
        repositories: [
          expect.objectContaining({
            name: skillMap1.name,
            id: skillMap1.id,
     
          }),
          expect.objectContaining({
            name: skillMap2.name,
            id: skillMap2.id,
         
          }),
        ],
      });
      await expect(skillService.findSkillRepositories(2, 1, null, null, null)).resolves.toMatchObject({
        repositories: [
          expect.objectContaining({
            name: skillMap3.name,
            id: skillMap3.id,
        
          }),
        ],
      });
    });
  });

  describe('listSkillMaps', () => {
    let skillMap1: SkillMap;
    let skillMap2: SkillMap;
    let skillMap3: SkillMap;

    beforeEach(async () => {
      // Wipe DB before test
      await dbUtils.wipeDb();

      skillMap1 = await db.skillMap.create({
        data: {
          name: 'First Map',
         
        },
      });
      skillMap2 = await db.skillMap.create({
        data: {
          name: 'Second Map',
          
        },
      });
      skillMap3 = await db.skillMap.create({
        data: {
          name: 'Third Map',
         
        },
      });
    });

    it('Not existing ID -> empty list', async () => {
      // Precondition: Some Skill-Maps defined
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

      // Test: Empty result list
      const expectedResult: SkillRepositoryListDto = {
        repositories: [],
      };
      await expect(skillService.listSkillMaps('not-existing-id')).resolves.toEqual(expectedResult);
    });

    it('Existing ID (User-1) -> Return list of repositories owned by the user', async () => {
      // Precondition: Some Skill-Maps defined
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

      // Expected result: 1st & 2nd map
      const maps: SkillRepositoryDto[] = [
        expect.objectContaining({
          id: skillMap1.id,
          name: skillMap1.name,
        
        }),
        expect.objectContaining({
          id: skillMap2.id,
          name: skillMap2.name,
        
        }),
      ];
      const expectedResult: SkillRepositoryListDto = {
        repositories: maps,
      };

      // Test: 1st & 2nd map (owned by User-1)
   
    });

    it('Existing ID (User-2) -> Return list of repository owned by the user', async () => {
      // Precondition: Some Skill-Maps defined
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

      // Expected result: 3rd map
      const maps: SkillRepositoryDto[] = [
        expect.objectContaining({
          id: skillMap3.id,
          name: skillMap3.name,
          
        }),
      ];
      const expectedResult: SkillRepositoryListDto = {
        repositories: maps,
      };

      // Test: 3rd map (owned by User-2)
     
    });
  });

  describe('loadSkillRepository', () => {
    let skillMap1: SkillMap;
    let skillMap2: SkillMap;
    let skillMap3: SkillMap;
    let skill1: Skill;
    let skill2: Skill;
    let nestedSkill1: Skill;

    beforeEach(async () => {
      // Wipe DB before test
      await dbUtils.wipeDb();

      skillMap1 = await db.skillMap.create({
        data: {
          name: 'First Map',
         
        },
      });
      skillMap2 = await db.skillMap.create({
        data: {
          name: 'Second Map',
         
        },
      });
      skillMap3 = await db.skillMap.create({
        data: {
          name: 'Third Map',
         
        },
      });
      skill1 = await dbUtils.createSkill(skillMap2, 'Skill 1');
      skill2 = await dbUtils.createSkill(skillMap2, 'Skill 2');
      await dbUtils.createSkill(skillMap3, 'Skill 3');
      nestedSkill1 = await dbUtils.createSkill(skillMap2, 'Nested Skill 1', [skill2.id]);
    });

    it('Existing RepositoryId -> Success', async () => {
      // Test: Load Skill-Map by ID
      const expectedResult: Partial<SkillRepositoryDto> = {
        id: skillMap1.id,
        name: skillMap1.name,
      
      };
      await expect(skillService.loadSkillRepository(skillMap1.id)).resolves.toMatchObject(expectedResult);
    });

    it('Not existing RepositoryId -> NotFoundException', async () => {
      // Test: Load Skill-Map by not existing ID
      await expect(skillService.loadSkillRepository('Not-existing-ID')).rejects.toThrowError(NotFoundException);
    });

    it('Existing Repository with skills -> Skills are resolved', async () => {
      // Expected result: skillMap2 with all (toplevel/nested) skills
      const expectedResult: Partial<UnresolvedSkillRepositoryDto> = {
        id: skillMap2.id,
        name: skillMap2.name,
       
        skills: [skill1.id, skill2.id, nestedSkill1.id], // Skill3 belongs to different repository
      };

      // Test: Load Skill-Map by ID
      await expect(skillService.loadSkillRepository(skillMap2.id)).resolves.toMatchObject(expectedResult);
    });
  });

  describe('getSkillRepository', () => {
    let skillMap3: SkillMap;

    beforeEach(async () => {
      // Wipe DB before test
      await dbUtils.wipeDb();

      await db.skillMap.create({
        data: {
          name: 'First Map',
         
        },
      });
      await db.skillMap.create({
        data: {
          name: 'Second Map',
         
        },
      });
      skillMap3 = await db.skillMap.create({
        data: {
          name: 'Third Map',
         
        },
      });
    });

    it('Repository of another owner loaded for writing -> ForbiddenException', async () => {
      // Precondition: Some Skill-Maps defined
      await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

      // Test: Load Skill-Map by ID and specify owner (for writing)
      await expect(skillService.getSkillRepository('User-1', skillMap3.id)).rejects.toThrowError(ForbiddenException);
    });
  });


  describe('getSkill', () => {
    let defaultSkillMap: SkillMap;

    beforeEach(async () => {
      defaultSkillMap = await dbUtils.createSkillMap('1', 'Test');
    });

    it('Non existing ID -> NotFoundException', async () => {
      // Precondition: No Skill-Maps defined
      await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 0 });

      // Test: NotFoundException
      await expect(skillService.getResolvedSkill('anyID')).rejects.toThrowError(NotFoundException);
    });

    it('Existing ID -> DTO representation', async () => {
      // Precondition: One skill exists
      const skill = await dbUtils.createSkill(defaultSkillMap, 'Skill 1');
      await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 1 });

      // Test: Load skill
      // Expected result: DTO representation of skill, without parent and nested skills
      const expectedResult: Partial<ResolvedSkillDto> = {
        id: skill.id,
        name: skill.name,
        level: skill.level,
        description: skill.description ?? undefined,
        nestedSkills: [],
      };
      await expect(skillService.getResolvedSkill(skill.id)).resolves.toMatchObject(expectedResult);
    });

    it('One nested Skill', async () => {
      // Precondition: One skill exists
      const skill1 = await dbUtils.createSkill(defaultSkillMap, 'Skill 1');
      const skill2 = await dbUtils.createSkill(defaultSkillMap, 'Skill 2', [skill1.id]);
      await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 2 });

      // Test: Load skill
      // Expected result: DTO representation of skill, without parent and nested skills
      const expectedChild: Partial<ResolvedSkillDto> = {
        id: skill2.id,
        name: skill2.name,
        level: skill2.level,
        description: skill2.description ?? undefined,
        nestedSkills: [],
      };
      const expectedParent: Partial<ResolvedSkillDto> = {
        id: skill1.id,
        name: skill1.name,
        level: skill1.level,
        description: skill1.description ?? undefined,
        nestedSkills: [expect.objectContaining(expectedChild)],
      };
      await expect(skillService.getResolvedSkill(skill1.id)).resolves.toMatchObject(expectedParent);
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
      const expectedSkill3: Partial<ResolvedSkillDto> = {
        id: skill3.id,
        name: skill3.name,
        level: skill3.level,
        description: skill3.description ?? undefined,
        nestedSkills: [],
      };
      const expectedChild: Partial<ResolvedSkillDto> = {
        id: skill2.id,
        name: skill2.name,
        level: skill2.level,
        description: skill2.description ?? undefined,
        nestedSkills: [expect.objectContaining(expectedSkill3)],
      };
      const expectedParent: Partial<ResolvedSkillDto> = {
        id: skill1.id,
        name: skill1.name,
        level: skill1.level,
        description: skill1.description ?? undefined,
        nestedSkills: [expect.objectContaining(expectedChild), expect.objectContaining(expectedSkill3)],
      };
      await expect(skillService.getResolvedSkill(skill1.id)).resolves.toMatchObject(expectedParent);
    });
  });

  describe('loadResolvedSkillRepository', () => {
    let defaultSkillMap: SkillMap;

    beforeEach(async () => {
      defaultSkillMap = await dbUtils.createSkillMap('User-1', 'Test', 'A Description');
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
      const result = skillService.loadResolvedSkillRepository(defaultSkillMap.id);

      // Expected result: DTO representation of skill, without parent and nested skills
      const expectedSkill3: Partial<ResolvedSkillDto> = {
        id: skill3.id,
        name: skill3.name,
        level: skill3.level,
        description: skill3.description ?? undefined,
        nestedSkills: [],
      };
      const expectedSkill2: Partial<ResolvedSkillDto> = {
        id: skill2.id,
        name: skill2.name,
        level: skill2.level,
        description: skill2.description ?? undefined,
        nestedSkills: [expect.objectContaining(expectedSkill3)],
      };
      const expectedSkill1: Partial<ResolvedSkillDto> = {
        id: skill1.id,
        name: skill1.name,
        level: skill1.level,
        description: skill1.description ?? undefined,
        nestedSkills: [expect.objectContaining(expectedSkill2), expect.objectContaining(expectedSkill3)],
      };
      const expectedSkill4: Partial<ResolvedSkillDto> = {
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
      defaultSkillMap = await dbUtils.createSkillMap('User-1', 'Test', 'A Description');
    });




  });
});
