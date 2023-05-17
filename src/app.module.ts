import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { SkillModule } from './skills/skill.module';
import { NuggetModule } from './nugget/nugget.module';
import { LearningPathModule } from './learningPath/learningPath.module';
import { DynamicLearningUnitModule } from './learningUnit/dynamic.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate, validationOptions: { allowUnknown: false } }),
    PrismaModule,
    SkillModule,
    NuggetModule,
    LearningPathModule,
    DynamicLearningUnitModule.register(),
  ],
})
export class AppModule {}
