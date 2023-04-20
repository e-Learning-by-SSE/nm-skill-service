import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SkillModule } from './skills/skill.module';
import { NuggetModule } from './nugget/nugget.module';
import { LearningPathModule } from './learningPath/learningPath.module';
import { DynamicLearningUnitModule } from './learningUnit/dynamic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    //RepositoryMgmtModule,
    //LoRepositoryModule,
    SkillModule,
    NuggetModule,
    LearningPathModule,
    DynamicLearningUnitModule.register(),
  ],
})
export class AppModule {}
