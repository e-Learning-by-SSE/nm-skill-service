import { Module } from '@nestjs/common';
import { BerufeNetController } from './berufeNetClient.controller';
import { BerufeService } from './berufeNetClient.service';
/**
 * Author: Carsten Wenzel
 */
@Module({
  controllers: [BerufeNetController],
  providers: [BerufeService],
  exports: [BerufeService],
})
export class ClientModule {}
