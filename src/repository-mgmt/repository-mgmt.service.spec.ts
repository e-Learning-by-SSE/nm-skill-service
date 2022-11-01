import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DbTestUtils } from '../DbTestUtils';
import { PrismaService } from '../prisma/prisma.service';
import { CompetenceCreationDto } from './dto/competence-creation.dto';
import { RepositoryCreationDto } from './dto/repository-creation.dto';
import { UeberCompetenceCreationDto } from './dto/ueber-competence-creation.dto';
import { UeberCompetenceModificationDto } from './dto/ueber-competence-modification.dto';
import { RepositoryMgmtService } from './repository-mgmt.service';

describe('Repository-Mgmt-Service', () => {
  // Test object
  let repositoryService: RepositoryMgmtService;

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
    repositoryService = new RepositoryMgmtService(db);
  });

  describe('List Repositories', () => {
    it('No userID -> empty list', async () => {
      await expect(repositoryService.listRepositories('')).resolves.toEqual({ repositories: [] });
    });

    it('User with no repository -> empty list', async () => {
      const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');

      await expect(repositoryService.listRepositories(user.id)).resolves.toEqual({ repositories: [] });
    });

    it('User has multiple repositories', async () => {
      const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');

      // Precondition: No repositories
      await expect(repositoryService.listRepositories(user.id)).resolves.toEqual({ repositories: [] });

      // Action: Add 2 repositories
      const repo1 = await dbUtils.createRepository(user.id, 'Repository 1');
      const repo2 = await dbUtils.createRepository(user.id, 'Repository 2');

      // Post-condition: 2 repositories created with expected names
      const repoList = await repositoryService.listRepositories(user.id);
      expect(repoList.repositories.length).toEqual(2);
      // Partial matching with any order based on: https://codewithhugo.com/jest-array-object-match-contain/
      const expected = expect.arrayContaining([
        expect.objectContaining({ name: repo1.name, userId: user.id }),
        expect.objectContaining({ name: repo2.name, userId: user.id }),
      ]);
      expect(repoList.repositories).toEqual(expected);
    });
  });

  describe('Get Repository', () => {
    it('Return repository with no competencies + show competencies', async () => {
      const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');
      const repository = await dbUtils.createRepository(user.id, 'Repository');

      // Retrieve repository from Db via service
      const includeCompetencies = true;
      const expectedData = { id: repository.id, userId: user.id };
      const actualRepository = await repositoryService.getRepository(user.id, repository.id, includeCompetencies);

      expect(actualRepository).toEqual(expect.objectContaining(expectedData));
      expect(actualRepository.competencies.length).toEqual(0);
      expect(actualRepository.uebercompetencies.length).toEqual(0);
    });

    it('Return repository with no competencies + do not show competencies', async () => {
      const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');
      const repository = await dbUtils.createRepository(user.id, 'Repository');

      // Retrieve repository from Db via service
      const includeCompetencies = false;
      const expectedData = { id: repository.id, userId: user.id };
      const actualRepository = await repositoryService.getRepository(user.id, repository.id, includeCompetencies);

      // Test Post-condition: 1 Repository with no displayed competencies
      expect(actualRepository).toEqual(expect.objectContaining(expectedData));
      expect(actualRepository).not.toHaveProperty('competencies');
      expect(actualRepository).not.toHaveProperty('uebercompetencies');
    });

    it('Error: Return Repository of different user', async () => {
      const userOwner = await dbUtils.createUser('1', 'First user', 'owner@example.com', 'pw');
      const userCaller = await dbUtils.createUser('2', 'Second user', 'caller@example.com', 'pw');
      const repository = await dbUtils.createRepository(userOwner.id, 'Repository');

      // Retrieve repository from Db via service
      await expect(repositoryService.getRepository(userCaller.id, repository.id)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Create Repository', () => {
    it('Create first repository', async () => {
      const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');

      // Precondition: No repositories
      await expect(repositoryService.listRepositories(user.id)).resolves.toEqual({ repositories: [] });

      // Action: Create first repository
      const creationData = {
        name: '1st Repository',
        taxonomy: 'Bloom',
        version: '1',
      };
      await repositoryService.createRepository(user.id, creationData);

      // Test Post-condition: 1 Repository with no competencies
      const expectedData = { ...creationData, userId: user.id };
      const repoList = await repositoryService.listRepositories(user.id);
      expect(repoList.repositories.length).toEqual(1);
      expect(repoList.repositories[0]).toEqual(expect.objectContaining(expectedData));

      // Test that newly created repository is empty
      const repository = await repositoryService.getRepository(user.id, repoList.repositories[0].id, true);
      expect(repository.competencies.length).toEqual(0);
      expect(repository.uebercompetencies.length).toEqual(0);
    });

    it('Fail: Create repository with name and version already in use', async () => {
      const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');
      const repository = await dbUtils.createRepository(user.id, 'Repository', 'v1');

      // Precondition: Repository exist and is the only one of the user
      const expectedData = { userId: user.id, name: repository.name, version: repository.version };
      const repoList = await repositoryService.listRepositories(user.id);
      expect(repoList.repositories.length).toEqual(1);
      expect(repoList.repositories[0]).toEqual(expect.objectContaining(expectedData));

      // Test: Attempt to create a second repository with same name and version -> Should fail
      const creationData: RepositoryCreationDto = {
        name: repository.name,
        taxonomy: undefined,
        version: repository.version,
      };
      const attempt = repositoryService.createRepository(user.id, creationData);
      await expect(attempt).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Create Competence', () => {
    it('Create first competence', async () => {
      const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');
      const repository = await dbUtils.createRepository(user.id, 'Repository');

      // Precondition: Repository contains no competences
      let repoData = await repositoryService.getRepository(user.id, repository.id, true);
      expect(repoData.competencies.length).toEqual(0);
      expect(repoData.uebercompetencies.length).toEqual(0);

      // Action: Create competence
      const compCreationData: CompetenceCreationDto = {
        skill: 'A skill',
        level: 1,
        description: 'A description',
      };
      await repositoryService.createCompetence(user.id, repository.id, compCreationData);

      // Post-condition: Repository contains only created competence
      repoData = await repositoryService.getRepository(user.id, repository.id, true);
      expect(repoData.competencies.length).toEqual(1);
      expect(repoData.uebercompetencies.length).toEqual(0);
      const newCompetence = repoData.competencies[0];
      expect(newCompetence).toEqual(expect.objectContaining(compCreationData));
    });

    it('Create first & empty Ueber-Competence', async () => {
      const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');
      const repository = await dbUtils.createRepository(user.id, 'Repository');

      // Precondition: Repository contains no competences
      let repoData = await repositoryService.getRepository(user.id, repository.id, true);
      expect(repoData.competencies.length).toEqual(0);
      expect(repoData.uebercompetencies.length).toEqual(0);

      // Action: Create competence
      const compCreationData: UeberCompetenceCreationDto = {
        name: 'Ueber-Competence',
        description: 'A description',
      };
      await repositoryService.createUeberCompetence(user.id, repository.id, compCreationData);

      // Post-condition: Repository contains only created competence
      repoData = await repositoryService.getRepository(user.id, repository.id, true);
      expect(repoData.competencies.length).toEqual(0);
      expect(repoData.uebercompetencies.length).toEqual(1);
      const newUeberCompetence = repoData.uebercompetencies[0];
      expect(newUeberCompetence).toEqual(expect.objectContaining(compCreationData));
    });
  });

  describe('Modify Competence', () => {
    it('Add first competences to empty Ueber-Competence', async () => {
      const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');
      const repository = await dbUtils.createRepository(user.id, 'Repository');
      await dbUtils.createCompetence(repository.id, 'Untouched Competence', 1);
      const movedCompetence = await dbUtils.createCompetence(repository.id, 'Moved Competence', 1);
      const ueberCompetence = await dbUtils.createUeberCompetence(repository.id, 'Ueber-Competence');

      // Precondition: Repository contains 3 competences; Ueber-Competence is empty
      let repoData = await repositoryService.loadResolvedRepository(user.id, repository.id);
      expect(repoData.competencies.length).toEqual(2);
      expect(repoData.ueberCompetencies.length).toEqual(1);
      let ueberCompetenceData = repoData.ueberCompetencies[0];
      expect(ueberCompetenceData.nestedCompetencies.length).toEqual(0);

      // Action: Create competence
      const modifyData: UeberCompetenceModificationDto = {
        ueberCompetenceId: ueberCompetence.id,
        nestedCompetencies: [movedCompetence.id],
        nestedUeberCompetencies: [],
      };
      await repositoryService.modifyUeberCompetence(user.id, repository.id, modifyData);

      // Post-condition: Same amount of competences; Ueber-Competence contains desired competence
      repoData = await repositoryService.loadResolvedRepository(user.id, repository.id);
      expect(repoData.competencies.length).toEqual(2);
      expect(repoData.ueberCompetencies.length).toEqual(1);
      ueberCompetenceData = repoData.ueberCompetencies[0];
      expect(ueberCompetenceData.nestedCompetencies.length).toEqual(1);
      const nestedCompetenceData = ueberCompetenceData.nestedCompetencies[0];
      expect(nestedCompetenceData.id).toEqual(movedCompetence.id);
    });

    it('Exchange competences of Ueber-Competence', async () => {
      const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');
      const repository = await dbUtils.createRepository(user.id, 'Repository');
      const firstCompetence = await dbUtils.createCompetence(repository.id, '1st Competence', 1);
      const secondCompetence = await dbUtils.createCompetence(repository.id, '2nd Competence', 1);
      const ueberCompetence = await dbUtils.createUeberCompetence(repository.id, 'Ueber-Competence');
      let modifyData: UeberCompetenceModificationDto = {
        ueberCompetenceId: ueberCompetence.id,
        nestedCompetencies: [firstCompetence.id],
        nestedUeberCompetencies: [],
      };
      await repositoryService.modifyUeberCompetence(user.id, repository.id, modifyData);

      // Precondition: Repository contains 3 competences; Ueber-Competence contains 1st competence
      let repoData = await repositoryService.loadResolvedRepository(user.id, repository.id);
      expect(repoData.competencies.length).toEqual(2);
      expect(repoData.ueberCompetencies.length).toEqual(1);
      let ueberCompetenceData = repoData.ueberCompetencies[0];
      expect(ueberCompetenceData.nestedCompetencies.length).toEqual(1);
      let nestedCompetenceData = ueberCompetenceData.nestedCompetencies[0];
      expect(nestedCompetenceData.id).toEqual(firstCompetence.id);

      // Action: Create competence
      modifyData = {
        ueberCompetenceId: ueberCompetence.id,
        nestedCompetencies: [secondCompetence.id],
        nestedUeberCompetencies: [],
      };
      await repositoryService.modifyUeberCompetence(user.id, repository.id, modifyData);

      // Post-condition: Same amount of competences; Ueber-Competence contains desired competence
      repoData = await repositoryService.loadResolvedRepository(user.id, repository.id);
      expect(repoData.competencies.length).toEqual(2);
      expect(repoData.ueberCompetencies.length).toEqual(1);
      ueberCompetenceData = repoData.ueberCompetencies[0];
      expect(ueberCompetenceData.nestedCompetencies.length).toEqual(1);
      nestedCompetenceData = ueberCompetenceData.nestedCompetencies[0];
      expect(nestedCompetenceData.id).toEqual(secondCompetence.id);
    });

    it('Nesting of Uber-Competencies', async () => {
      const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');
      const repository = await dbUtils.createRepository(user.id, 'Repository');
      const topUeberCompetence = await dbUtils.createUeberCompetence(repository.id, '1st Ueber-Competence');
      const nestedUeberCompetence = await dbUtils.createUeberCompetence(repository.id, '2nd Ueber-Competence');

      // Precondition: Repository contains 2 competences; Ueber-Competencies are empty
      let repoData = await repositoryService.loadResolvedRepository(user.id, repository.id);
      expect(repoData.competencies.length).toEqual(0);
      expect(repoData.ueberCompetencies.length).toEqual(2);
      // Partial matching with any order based on: https://codewithhugo.com/jest-array-object-match-contain/
      let expected = expect.arrayContaining([
        expect.objectContaining({
          id: topUeberCompetence.id,
          nestedCompetencies: [],
          nestedUeberCompetencies: [],
        }),
        expect.objectContaining({
          id: nestedUeberCompetence.id,
          nestedCompetencies: [],
          nestedUeberCompetencies: [],
        }),
      ]);
      expect(repoData.ueberCompetencies).toEqual(expected);

      // Action: Create competence
      const modifyData: UeberCompetenceModificationDto = {
        ueberCompetenceId: topUeberCompetence.id,
        nestedCompetencies: [],
        nestedUeberCompetencies: [nestedUeberCompetence.id],
      };
      await repositoryService.modifyUeberCompetence(user.id, repository.id, modifyData);

      // Post-condition: Same amount of competences; Ueber-Competence contains desired competence
      repoData = await repositoryService.loadResolvedRepository(user.id, repository.id);
      expect(repoData.competencies.length).toEqual(0);
      expect(repoData.ueberCompetencies.length).toEqual(2);
      expected = expect.arrayContaining([
        expect.objectContaining({
          id: topUeberCompetence.id,
          nestedCompetencies: [],
          nestedUeberCompetencies: [expect.objectContaining({ id: nestedUeberCompetence.id })],
        }),
        expect.objectContaining({
          id: nestedUeberCompetence.id,
          nestedCompetencies: [],
          nestedUeberCompetencies: [],
        }),
      ]);
      expect(repoData.ueberCompetencies).toEqual(expected);
    });
  });
});
