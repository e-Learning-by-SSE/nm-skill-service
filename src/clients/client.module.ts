import { Module } from '@nestjs/common';
import { JobsNetController } from './jobNetClient.controller';
import { JobsService } from './jobNetClient.service';

@Module({
  controllers: [JobsNetController],
  providers: [JobsService],
  exports: [JobsService],
})
export class ClientModule {}
