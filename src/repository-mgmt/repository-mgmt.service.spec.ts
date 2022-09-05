import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { RepositoryMgmtService } from './repository-mgmt.service';

describe('Repository-Mgmt-Service', () => {
  // Test object
  let repositoryService: RepositoryMgmtService;

  let db: PrismaService;

  // Auxillary
  let config: ConfigService;

  beforeAll(async () => {
    config = new ConfigService();
    db = new PrismaService(config);

    // Wipe DB before test
    await db.repository.deleteMany();
    await db.user.deleteMany();
  });

  beforeEach(async () => {
    repositoryService = new RepositoryMgmtService(db);
  });

  it('List Repositories (fail): No userID', async () => {
    await expect(repositoryService.listRepositories('')).resolves.toEqual({ repositories: [] });
  });
});
