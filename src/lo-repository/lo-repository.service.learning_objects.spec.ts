import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Competence, LoRepository, Repository, UeberCompetence, User } from '@prisma/client';

import { DbTestUtils } from '../DbTestUtils';
import { PrismaService } from '../prisma/prisma.service';
import { LoRepositoryCreationDto } from './dto';
import { LearningObjectDto } from './dto/export/learning-object.dto';
import { LearningObjectCreationDto } from './dto/learning-object-creation.dto';
import { LoRepositoryModifyDto } from './dto/lo-repository-modify.dto';
import { LoRepositoryService } from './lo-repository.service';

describe('LO-Repository Service (Learning Objects)', () => {
  // Test object
  let repositoryService: LoRepositoryService;

  // Test data
  let owner: User;
  let compRepository: Repository;
  let competence1: Competence;
  let competence2: Competence;
  let ueberCompetence1: UeberCompetence;
  let ueberCompetence2: UeberCompetence;
  let loRepository: LoRepository;

  let db: PrismaService;
  let dbUtils: DbTestUtils;

  // Auxillary
  let config: ConfigService;

  beforeAll(async () => {
    config = new ConfigService();
    db = new PrismaService(config);
    dbUtils = DbTestUtils.getInstance();
  });

  beforeEach(async () => {
    // Wipe DB before test
    await dbUtils.wipeDb();
    repositoryService = new LoRepositoryService(db);

    owner = await dbUtils.createUser('1', 'Owner', 'owner@example.com', 'pw');
    loRepository = await dbUtils.createLoRepository(owner.id, 'A LO-Repository');
  });

  // Create Competence repository; required for some tests
  async function createCompetenceRepository() {
    compRepository = await dbUtils.createRepository(owner.id, 'A Competence Repository');
    competence1 = await dbUtils.createCompetence(compRepository.id, 'First skill', 1);
    competence2 = await dbUtils.createCompetence(compRepository.id, 'Second skill', 2);
    ueberCompetence1 = await dbUtils.createUeberCompetence(compRepository.id, 'First Ueber-Competence');
    ueberCompetence2 = await dbUtils.createUeberCompetence(compRepository.id, 'Second Ueber-Competence');
  }

  describe('Load Learning Objects', () => {
    it('Load non existing Learning Object -> fail', async () => {
      // Action: Try to retrieve non existent learning object
      const lo = repositoryService.loadLearningObject('non-existent-id');

      // Post-Condition: Not found
      await expect(lo).rejects.toThrow(NotFoundException);
    });

    it('Load empty Learning Object', async () => {
      const createdLo = await dbUtils.createLearningObject(loRepository.id, 'A LO', 'A description');

      // Action: Try to retrieve non existent learning object
      const retrievedLo = await repositoryService.loadLearningObject(createdLo.id);

      // Post-Condition: DTO contains same data as DAO; no requires/offers
      const expected: LearningObjectDto = {
        id: createdLo.id,
        name: createdLo.name,
        description: createdLo.description ?? undefined,
        loRepositoryId: loRepository.id,
        requiredCompetencies: [],
        requiredUeberCompetencies: [],
        offeredCompetencies: [],
        offeredUeberCompetencies: [],
      };
      expect(retrievedLo).toEqual(expect.objectContaining(expected));
    });

    it('Load Learning Object with referenced competencies', async () => {
      await createCompetenceRepository();
      const createdLo = await dbUtils.createLearningObject(
        loRepository.id,
        'A LO',
        'A description',
        [competence1.id],
        [ueberCompetence1.id],
        [competence2.id],
        [ueberCompetence2.id],
      );

      // Action: Try to retrieve non existent learning object
      const retrievedLo = await repositoryService.loadLearningObject(createdLo.id);

      // Post-Condition: DTO contains same data as DAO; requires/offers correctly returned
      const expected: LearningObjectDto = {
        id: createdLo.id,
        name: createdLo.name,
        description: createdLo.description ?? undefined,
        loRepositoryId: loRepository.id,
        requiredCompetencies: [competence1.id],
        requiredUeberCompetencies: [ueberCompetence1.id],
        offeredCompetencies: [competence2.id],
        offeredUeberCompetencies: [ueberCompetence2.id],
      };
      expect(retrievedLo).toEqual(expect.objectContaining(expected));
    });
  });

  describe('Create Learning Objects', () => {
    it('Create empty Learning Object', async () => {
      const creationData: LearningObjectCreationDto = {
        name: 'A Lo',
        requiredCompetencies: [],
        requiredUeberCompetencies: [],
        offeredCompetencies: [],
        offeredUeberCompetencies: [],
      };

      // Action: Create new Lo
      const newLo = await repositoryService.createLearningObject(owner.id, loRepository.id, creationData);

      // Post-Condition: Check specified data
      const expectedData = expect.objectContaining({
        ...creationData,
        loRepositoryId: loRepository.id,
      });
      expect(newLo).toEqual(expectedData);
    });

    it('Create Learning Object for different user -> fail', async () => {
      const anotherUser = dbUtils.createUser('2', 'Another user', 'mail@example.com', 'pw');
      const creationData: LearningObjectCreationDto = {
        name: 'A Lo',
        requiredCompetencies: [],
        requiredUeberCompetencies: [],
        offeredCompetencies: [],
        offeredUeberCompetencies: [],
      };

      // Action: Create new Lo
      const newLo = repositoryService.createLearningObject((await anotherUser).id, loRepository.id, creationData);

      // Post-Condition: ForbiddenException
      await expect(newLo).rejects.toThrow(ForbiddenException);
    });
  });

  it('Create Learning Object with requires/offers', async () => {
    await createCompetenceRepository();
    const creationData: LearningObjectCreationDto = {
      name: 'A Lo',
      requiredCompetencies: [competence1.id],
      requiredUeberCompetencies: [ueberCompetence1.id],
      offeredCompetencies: [competence2.id],
      offeredUeberCompetencies: [ueberCompetence2.id],
    };

    // Action: Create new Lo
    const newLo = await repositoryService.createLearningObject(owner.id, loRepository.id, creationData);

    // Post-Condition: Check specified data
    const expectedData = expect.objectContaining({
      ...creationData,
      loRepositoryId: loRepository.id,
    });
    expect(newLo).toEqual(expectedData);
  });
});
