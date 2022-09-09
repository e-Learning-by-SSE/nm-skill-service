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
    const user = await dbUtils.createTestUser('1', 'An user', 'mail@example.com', 'pw');

    await expect(repositoryService.listRepositories(user.id)).resolves.toEqual({ repositories: [] });
  });

  it('List Repositories: User has multiple repositories', async () => {
    const user = await dbUtils.createTestUser('1', 'An user', 'mail@example.com', 'pw');

    // Precondition: No repositories
    await expect(repositoryService.listRepositories(user.id)).resolves.toEqual({ repositories: [] });

    // Action: Add 2 repositores
    const repo1 = await dbUtils.createTestRepository(user.id, 'Repository 1');
    const repo2 = await dbUtils.createTestRepository(user.id, 'Repository 2');

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

  it('Create Repository: Create first repository', async () => {
    const user = await dbUtils.createTestUser('1', 'An user', 'mail@example.com', 'pw');

    // Precondition: No repositories
    await expect(repositoryService.listRepositories(user.id)).resolves.toEqual({ repositories: [] });

    // Action: Create first repositry
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
    // TODO: Check no existing competencies
  });
});
