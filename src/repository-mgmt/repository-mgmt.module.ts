import { Module } from '@nestjs/common';

import { RepositoryMgmtController } from './repository-mgmt.controller';
import { RepositoryMgmtService } from './repository-mgmt.service';

@Module({
  controllers: [RepositoryMgmtController],
  providers: [RepositoryMgmtService],
})
export class RepositoryMgmtModule {}
