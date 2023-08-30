import { Module } from '@nestjs/common';

import { UserMgmtController } from './user.controller';
import { UserMgmtService } from './user.service';

@Module({
  controllers: [UserMgmtController],
  providers: [UserMgmtService],
  exports: [UserMgmtService],
})
export class UserModule {}
