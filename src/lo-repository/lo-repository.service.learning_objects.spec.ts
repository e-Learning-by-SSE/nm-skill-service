import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Competence, LoRepository, Repository, UeberCompetence, User } from '@prisma/client';

import { DbTestUtils } from '../DbTestUtils';
import { PrismaService } from '../prisma/prisma.service';
import { LearningObjectDto } from './dto/export/learning-object.dto';
import { LearningObjectCreationDto } from './dto/learning-object-creation.dto';
import { LearningObjectModificationDto } from './dto/learning-object-modification.dto';
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

  describe('Modify Learning Objects', () => {
    it('Modify LO of different user -> fail', async () => {
      const anotherUser = await dbUtils.createUser('2', 'Another user', 'mail@example.com', 'pw');
      const lo = await dbUtils.createLearningObject(loRepository.id, 'A LO');

      // Action: Try to modify
      const modData: LearningObjectModificationDto = {
        name: 'Changed Name',
      };
      const modifyResult = repositoryService.modifyLearningObject(anotherUser.id, loRepository.id, lo.id, modData);

      // Post-Condition: ForbiddenException
      await expect(modifyResult).rejects.toThrow(ForbiddenException);
    });

    it('Modify non-existent LO -> fail', async () => {
      await dbUtils.createLearningObject(loRepository.id, 'A LO');

      // Action: Try to modify
      const modData: LearningObjectModificationDto = {
        name: 'Changed Name',
      };
      const modifyResult = repositoryService.modifyLearningObject(
        owner.id,
        loRepository.id,
        'non-existent-id',
        modData,
      );

      // Post-Condition: NotFoundException
      await expect(modifyResult).rejects.toThrow(NotFoundException);
    });

    it('Modify LO of different repository then specified -> fail', async () => {
      const loRepository2 = await dbUtils.createLoRepository(owner.id, 'A second repository');
      const lo = await dbUtils.createLearningObject(loRepository.id, 'A LO');

      // Action: Try to modify
      const modData: LearningObjectModificationDto = {
        name: 'Changed Name',
      };
      const modifyResult = repositoryService.modifyLearningObject(owner.id, loRepository2.id, lo.id, modData);

      // Post-Condition: ForbiddenException
      await expect(modifyResult).rejects.toThrow(ForbiddenException);
    });

    it('Change name and description of LO', async () => {
      const lo = await dbUtils.createLearningObject(loRepository.id, 'A LO');
      const modData: LearningObjectModificationDto = {
        name: 'Changed Name',
        description: 'Changed description',
      };

      // Pre-Condition: Different name and description as to change
      expect(lo).toEqual(expect.not.objectContaining(modData));

      // Action: Try to modify
      const modifyResult = await repositoryService.modifyLearningObject(owner.id, loRepository.id, lo.id, modData);

      // Post-Condition: DTO should contain modified data
      expect(modifyResult).toEqual(expect.objectContaining(modData));
    });

    it('Exchange competencies of LO', async () => {
      await createCompetenceRepository();
      const lo = await dbUtils.createLearningObject(
        loRepository.id,
        'A LO',
        'A description',
        [competence1.id],
        [ueberCompetence1.id],
        [competence2.id],
        [ueberCompetence2.id],
      );

      // Pre-Condition: Competencies as specified during creation
      // Test on DAO: Requires nested objectContaining-matcher
      expect(lo).toEqual(
        expect.objectContaining({
          requiredCompetencies: [expect.objectContaining({ id: competence1.id })],
          requiredUeberCompetencies: [expect.objectContaining({ id: ueberCompetence1.id })],
          offeredCompetencies: [expect.objectContaining({ id: competence2.id })],
          offeredUeberCompetencies: [expect.objectContaining({ id: ueberCompetence2.id })],
        }),
      );

      // Action: Try to modify (exchange all competencies: 1 <-> 2)
      const modData: LearningObjectModificationDto = {
        requiredCompetencies: [competence2.id],
        requiredUeberCompetencies: [ueberCompetence2.id],
        offeredCompetencies: [competence1.id],
        offeredUeberCompetencies: [ueberCompetence1.id],
      };
      const modifyResult = await repositoryService.modifyLearningObject(owner.id, loRepository.id, lo.id, modData);

      // Post-Condition: DTO should contain modified data
      expect(modifyResult).toEqual(expect.objectContaining(modData));
    });
  });
});
