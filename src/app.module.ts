import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { LoRepositoryModule } from './lo-repository/lo-repository.module';
import { PrismaModule } from './prisma/prisma.module';
import { RepositoryMgmtModule } from './repository-mgmt/repository-mgmt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    RepositoryMgmtModule,
    LoRepositoryModule,
  ],
})
export class AppModule {}
