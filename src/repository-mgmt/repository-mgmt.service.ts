import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class RepositoryMgmtService {
  constructor(private db: PrismaService) {}

  listRepositories(userId: string) {
    const repositories = this.db.repository.findMany({
      where: {
        userId: userId,
      },
    });

    return { repositories: repositories };
  }
}
