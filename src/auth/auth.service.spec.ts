import * as argon from 'argon2';

import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  // Test object
  let authService: AuthService;

  let db: PrismaService;
  let testUser: User;

  // Auxillary
  let jwt: JwtService;
  let config: ConfigService;

  /**
   * Auxillary function for testing: Creates a new user.
   */
  async function createTestUser(id: string, name: string, email: string, pw: string) {
    const hash = await argon.hash(pw);

    const user = await db.user.create({
      data: {
        id: id,
        name: name,
        email: email,
        pw: hash,
      },
    });

    return user;
  }

  beforeAll(async () => {
    config = new ConfigService();
    db = new PrismaService(config);

    // Wipe DB before test
    await db.repository.deleteMany();
    await db.user.deleteMany();

    testUser = await createTestUser('1', 'A Test User', 'mail@example.com', 'pw');
  });

  beforeEach(() => {
    jwt = new JwtService();
    authService = new AuthService(db, jwt, config);
  });

  it('Login: Wrong Mail', async () => {
    await expect(authService.login({ email: 'mail@not_existing.com', password: 'pw' })).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('Login: Wrong Password', async () => {
    await expect(authService.login({ email: testUser.email, password: 'wrong pw' })).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('Login: Correct creddentials', async () => {
    await expect(authService.login({ email: testUser.email, password: 'pw' })).resolves.toHaveProperty('access_token');
  });
});
