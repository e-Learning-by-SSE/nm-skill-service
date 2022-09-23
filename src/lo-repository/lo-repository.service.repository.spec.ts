import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DbTestUtils } from '../DbTestUtils';
import { PrismaService } from '../prisma/prisma.service';
import { LoRepositoryCreationDto } from './dto';
import { LoRepositoryModifyDto } from './dto/lo-repository-modify.dto';
import { LoRepositoryService } from './lo-repository.service';

describe('LO-Repository Service (Repositories)', () => {
  // Test object
  let repositoryService: LoRepositoryService;

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
  });

  describe('List Repositories', () => {
    it('No existing repositories -> empty list', async () => {
      await expect(repositoryService.listRepositories()).resolves.toEqual({ repositories: [] });
    });

    it('1 repository -> contained in list', async () => {
      const user = await dbUtils.createUser('1', 'User', 'mail@example.com', 'pw');
      const repository = await dbUtils.createLoRepository(user.id, 'A repository', undefined);

      // Action: Retrieve complete repository list
      const repositoryList = await repositoryService.listRepositories();

      // Post-Condition: List should contain 1 repository, created by user.
      expect(repositoryList.repositories.length).toBe(1);
      expect(repositoryList.repositories[0]).toEqual(
        expect.objectContaining({
          owner: user.id,
          id: repository.id,
          name: repository.name,
          description: repository.description ?? undefined,
        }),
      );
    });

    it('Repositories of different users -> All repositories contained in list', async () => {
      const user1 = await dbUtils.createUser('1', 'First User', 'mail1@example.com', 'pw');
      const repository1 = await dbUtils.createLoRepository(user1.id, 'First Repository', undefined);
      const user2 = await dbUtils.createUser('2', 'Second User', 'mail2@example.com', 'pw');
      const repository2 = await dbUtils.createLoRepository(user2.id, 'Second Repository', undefined);

      // Action: Retrieve complete repository list
      const repositoryList = await repositoryService.listRepositories();

      // Post-Condition: List should contain 2 repositories, 1 created by each user.
      expect(repositoryList.repositories.length).toBe(2);
      const expected = expect.arrayContaining([
        expect.objectContaining({
          owner: user1.id,
          id: repository1.id,
          name: repository1.name,
          description: repository1.description ?? undefined,
        }),
        expect.objectContaining({
          owner: user2.id,
          id: repository2.id,
          name: repository2.name,
          description: repository2.description ?? undefined,
        }),
      ]);

      expect(repositoryList.repositories).toEqual(expected);
    });
  });

  describe('Load Repository', () => {
    it('Load existing, empty repository', async () => {
      const user = await dbUtils.createUser('1', 'User', 'mail@example.com', 'pw');
      const repository = await dbUtils.createLoRepository(user.id, 'First Repository', undefined);

      // Action: Load specified repository
      const loaded = repositoryService.loadRepository(repository.id);

      // Post condition: Repository exists and represents created values
      expect(await loaded).toEqual(
        expect.objectContaining({
          id: repository.id,
          name: repository.name,
          owner: user.id,
          description: repository.description ?? undefined,
          learningObjects: [],
        }),
      );
    });

    it('Load non-existing repository (fail)', async () => {
      const user = await dbUtils.createUser('1', 'User', 'mail@example.com', 'pw');
      const repository = await dbUtils.createLoRepository(user.id, 'First Repository', undefined);

      // Action: Load specified repository
      const loaded = repositoryService.loadRepository('non-existing-id');

      // Post condition: Repository exists and represents created values
      await expect(loaded).rejects.toThrow(NotFoundException);
    });

    it('Load existing, non-empty repository', async () => {
      const user = await dbUtils.createUser('1', 'User', 'mail@example.com', 'pw');
      const repository = await dbUtils.createLoRepository(user.id, 'First Repository', undefined);
      const lo = await dbUtils.createLearningObject(repository.id, 'A LO', undefined);

      // Action: Load specified repository
      const loaded = repositoryService.loadRepository(repository.id);

      // Post condition: Repository exists and represents created values
      expect(await loaded).toEqual(
        expect.objectContaining({
          id: repository.id,
          name: repository.name,
          owner: user.id,
          description: repository.description ?? undefined,
          learningObjects: [lo.id],
        }),
      );
    });
  });

  describe('Repository Creation', () => {
    it('Create first repository', async () => {
      const user = await dbUtils.createUser('1', 'User', 'mail@example.com', 'pw');

      // Action: Create new repository
      const creationData: LoRepositoryCreationDto = {
        name: 'First repository',
        description: 'A description',
      };
      await repositoryService.createNewRepository(user.id, creationData);

      // Post-Condition: Only new created repository exist
      const repositoryList = await repositoryService.listRepositories();
      expect(repositoryList.repositories.length).toBe(1);
      expect(repositoryList.repositories[0]).toEqual(
        expect.objectContaining({
          owner: user.id,
          ...creationData,
        }),
      );
    });
  });

  describe('Repository Creation', () => {
    it('Create repository with name conflict -> fail', async () => {
      const user = await dbUtils.createUser('1', 'User', 'mail@example.com', 'pw');
      const repository = await dbUtils.createLoRepository(user.id, 'First Repository', undefined);

      // Action: Create new repository
      const creationData: LoRepositoryCreationDto = {
        name: repository.name,
        description: 'A new description',
      };
      const result = repositoryService.createNewRepository(user.id, creationData);

      // Post-Condition: Exception
      await expect(result).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Repository Creation', () => {
    it('Other user creates repository with name in use -> allowed', async () => {
      const user1 = await dbUtils.createUser('1', 'User1', 'mail1@example.com', 'pw');
      const repository1 = await dbUtils.createLoRepository(user1.id, 'First Repository', 'A description');
      const user2 = await dbUtils.createUser('2', 'User2', 'mail2@example.com', 'pw');

      // Action: Create new repository
      const creationData: LoRepositoryCreationDto = {
        name: repository1.name,
        description: 'A description',
      };
      const result = await repositoryService.createNewRepository(user2.id, creationData);

      // Post-Condition: Both repositories should exist.
      const repositoryList = await repositoryService.listRepositories();
      expect(repositoryList.repositories.length).toBe(2);
      const expected = expect.arrayContaining([
        expect.objectContaining({
          owner: user1.id,
          id: repository1.id,
          name: repository1.name,
          description: repository1.description ?? undefined,
        }),
        expect.objectContaining({
          owner: user2.id,
          id: result.id,
          ...creationData,
        }),
      ]);

      expect(repositoryList.repositories).toEqual(expected);
    });
  });

  describe('Repository Modification', () => {
    it('Rename repository and delete description', async () => {
      const user = await dbUtils.createUser('1', 'User', 'mail@example.com', 'pw');
      const repository = await dbUtils.createLoRepository(user.id, 'First Repository', 'A description');

      // Action: Rename repository
      const modification: LoRepositoryModifyDto = {
        name: 'Renamed Repository',
      };
      await repositoryService.modifyRepository(user.id, repository.id, modification);

      // Post condition: New name, old description
      const changedRepository = await repositoryService.loadRepository(repository.id);
      expect(changedRepository).toEqual(
        expect.objectContaining({
          id: repository.id,
          name: modification.name,
          description: modification.description,
          owner: user.id,
        }),
      );
    });

    it('Change description, keep name untouched', async () => {
      const user = await dbUtils.createUser('1', 'User', 'mail@example.com', 'pw');
      const repository = await dbUtils.createLoRepository(user.id, 'First Repository', 'A description');

      // Action: Rename repository
      const modification: LoRepositoryModifyDto = {
        description: 'A new description',
      };
      await repositoryService.modifyRepository(user.id, repository.id, modification);

      // Post condition: New name, old description
      const changedRepository = await repositoryService.loadRepository(repository.id);
      expect(changedRepository).toEqual(
        expect.objectContaining({
          id: repository.id,
          name: repository.name,
          description: modification.description,
          owner: user.id,
        }),
      );
    });

    it('Change repository of different user -> fail', async () => {
      const owner = await dbUtils.createUser('1', 'Owner', 'owner@example.com', 'pw');
      const otherUser = await dbUtils.createUser('2', 'Another User', 'other@example.com', 'pw');
      const repository = await dbUtils.createLoRepository(owner.id, 'First Repository', 'A description');

      // Action: Rename repository
      const modification: LoRepositoryModifyDto = {
        name: 'Renamed Repository',
      };
      const change = repositoryService.modifyRepository(otherUser.id, repository.id, modification);

      // Post condition: Change should be forbidden
      await expect(change).rejects.toThrow(ForbiddenException);
    });

    it('Change non existent repository -> fail', async () => {
      const owner = await dbUtils.createUser('1', 'Owner', 'owner@example.com', 'pw');

      // Action: Rename repository
      const modification: LoRepositoryModifyDto = {
        name: 'Renamed Repository',
      };
      const change = repositoryService.modifyRepository(owner.id, 'non-existing-id', modification);

      // Post condition: Repository not found
      await expect(change).rejects.toThrow(NotFoundException);
    });

    it('Modify repository without any change -> fail', async () => {
      const owner = await dbUtils.createUser('1', 'Owner', 'owner@example.com', 'pw');
      const repository = await dbUtils.createLoRepository(owner.id, 'First Repository', 'A description');

      // Action: Rename repository
      const modification: LoRepositoryModifyDto = {
        name: repository.name,
        description: repository.description ?? undefined,
      };
      const change = repositoryService.modifyRepository(owner.id, repository.id, modification);

      // Post condition: No changed data (range error)
      await expect(change).rejects.toThrow(BadRequestException);
    });
  });
});
