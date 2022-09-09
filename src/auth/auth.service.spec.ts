import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { DbTestUtils } from '../DbTestUtils';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  // Test object
  let authService: AuthService;

  let db: PrismaService;
  let dbUtils: DbTestUtils;
  let testUser: User;

  // Auxillary
  let jwt: JwtService;
  let config: ConfigService;

  beforeAll(() => {
    config = new ConfigService();
    db = new PrismaService(config);
    dbUtils = DbTestUtils.getInstance();
  });

  beforeEach(async () => {
    jwt = new JwtService();
    authService = new AuthService(db, jwt, config);

    // Wipe DB before test
    await db.repository.deleteMany();
    await db.user.deleteMany();

    testUser = await dbUtils.createTestUser('1', 'A Test User', 'mail@example.com', 'pw');
  });

  it('Login (fail): Wrong Mail', async () => {
    await expect(authService.login({ email: 'mail@not_existing.com', password: 'pw' })).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('Login (fail): Wrong Password', async () => {
    await expect(authService.login({ email: testUser.email, password: 'wrong pw' })).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('Login: Correct creddentials', async () => {
    await expect(authService.login({ email: testUser.email, password: 'pw' })).resolves.toHaveProperty('access_token');
  });

  it('Register (fail): eMail already used', async () => {
    await expect(authService.register({ email: testUser.email, name: 'a name', password: 'pw' })).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('Register: New user added', async () => {
    try {
      const new_user = await authService.register({ email: 'mail2@example.com', name: 'a name', password: 'pw' });
      expect(new_user).toHaveProperty('access_token');
    } catch (e) {
      fail(e);
    }
  });
});
