import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DbTestUtils } from '../DbTestUtils';
import { PrismaService } from '../prisma/prisma.service';
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

  it('List Repositories: No userID -> empty list', async () => {
    await expect(repositoryService.listRepositories('')).resolves.toEqual({ repositories: [] });
  });

  it('List Repositories: User with no repository -> empty list', async () => {
    const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');

    await expect(repositoryService.listRepositories(user.id)).resolves.toEqual({ repositories: [] });
  });

  it('List Repositories: User has multiple repositories', async () => {
    const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');

    // Precondition: No repositories
    await expect(repositoryService.listRepositories(user.id)).resolves.toEqual({ repositories: [] });

    // Action: Add 2 repositores
    const repo1 = await dbUtils.createRepository(user.id, 'Repository 1');
    const repo2 = await dbUtils.createRepository(user.id, 'Repository 2');

    // Test Postcondition: 2 repositories created with expected names
    const repoList = await repositoryService.listRepositories(user.id);
    expect(repoList.repositories.length).toEqual(2);
    // Partial matching with any order based on: https://codewithhugo.com/jest-array-object-match-contain/
    const expected = expect.arrayContaining([
      expect.objectContaining({ name: repo1.name, userId: user.id }),
      expect.objectContaining({ name: repo2.name, userId: user.id }),
    ]);
    expect(repoList.repositories).toEqual(expected);
  });

  it('Get Repository: Return repository with no competencies + show competencies', async () => {
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

  it('Get Repository: Return repository with no competencies + do not show competencies', async () => {
    const user = await dbUtils.createUser('1', 'An user', 'mail@example.com', 'pw');
    const repository = await dbUtils.createRepository(user.id, 'Repository');

    // Retrieve repository from Db via service
    const includeCompetencies = false;
    const expectedData = { id: repository.id, userId: user.id };
    const actualRepository = await repositoryService.getRepository(user.id, repository.id, includeCompetencies);

    // Test Postcondition: 1 Repository with no displayed competencies
    expect(actualRepository).toEqual(expect.objectContaining(expectedData));
    expect(actualRepository).not.toHaveProperty('competencies');
    expect(actualRepository).not.toHaveProperty('uebercompetencies');
  });

  it('Get Repository (fail): Return Repository of different user', async () => {
    const userOwner = await dbUtils.createUser('1', 'First user', 'owner@example.com', 'pw');
    const userCaller = await dbUtils.createUser('2', 'Second user', 'caller@example.com', 'pw');
    const repository = await dbUtils.createRepository(userOwner.id, 'Repository');

    // Retrieve repository from Db via service
    await expect(repositoryService.getRepository(userCaller.id, repository.id)).rejects.toThrow(ForbiddenException);
  });

  it('Create Repository: Create first repository', async () => {
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

    // Test Postcondition: 1 Repository with no competencies
    const expectedData = { ...creationData, userId: user.id };
    const repoList = await repositoryService.listRepositories(user.id);
    expect(repoList.repositories.length).toEqual(1);
    expect(repoList.repositories[0]).toEqual(expect.objectContaining(expectedData));

    // Test that newly created repository is empty
    const repository = await repositoryService.getRepository(user.id, repoList.repositories[0].id, true);
    expect(repository.competencies.length).toEqual(0);
    expect(repository.uebercompetencies.length).toEqual(0);
  });

  // it('Add Competencies: Create first competency', async () => {});
});
