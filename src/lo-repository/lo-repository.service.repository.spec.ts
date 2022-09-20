import { ConfigService } from '@nestjs/config';

import { DbTestUtils } from '../DbTestUtils';
import { PrismaService } from '../prisma/prisma.service';
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

      // Post-Condition: List should contain 1 repository, created by user.
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
});
