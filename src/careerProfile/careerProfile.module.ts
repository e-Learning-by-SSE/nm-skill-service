import { Module } from '@nestjs/common';

import { CareerProfileController } from './careerProfile.controller';
import { CareerProfileService } from './careerProfile.service';

@Module({
  controllers: [CareerProfileController],
  providers: [CareerProfileService],
  exports: [CareerProfileService],
})
export class CareerProfileModule {}