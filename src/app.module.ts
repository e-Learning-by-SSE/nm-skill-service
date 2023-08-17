import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { SkillModule } from './skills/skill.module';
import { DynamicNuggetModuleModule } from './nugget/nugget.module';
import { LearningPathModule } from './learningPath/learningPath.module';
import { LearningUnitModule } from './learningUnit/learningUnit.module';
import { validate } from './config/env.validation';
import { PathFinderModule } from './pathFinder/pathFinder.module';
import { UserMgmtController } from './user/user.controller';
import { DynamicUserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate, validationOptions: { allowUnknown: false } }),
    PrismaModule,
    SkillModule,
    DynamicNuggetModuleModule.register(),
    LearningPathModule,
    LearningUnitModule,
    PathFinderModule,
    DynamicUserModule.register(),
  ],
})
export class AppModule {}
