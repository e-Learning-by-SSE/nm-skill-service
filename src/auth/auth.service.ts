import * as argon from 'argon2';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, LoginAckDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private db: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  async login(dto: LoginDto) {
    // Find user by email
    const user = await this.db.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // Compare password
    const pwMatches = await argon.verify(user.pw, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // Return User
    const result: LoginAckDto = {
      id: user.id,
      email: user.email,
      name: user.name ?? '',
      ...(await this.signToken(user.id, user.email, user.name)),
    };
    return result;
  }

  async register(dto: AuthDto) {
    // Generate password
    const hash = await argon.hash(dto.password);

    // Save user
    try {
      const user = await this.db.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          pw: hash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      // Return saved user
      const result: LoginAckDto = {
        id: user.id,
        email: user.email,
        name: user.name ?? '',
        ...(await this.signToken(user.id, user.email, user.name)),
      };
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('E-Mail address already in use');
        }
      }
      throw error;
    }
  }

  async signToken(userID: string, email: string, name: string | null): Promise<{ access_token: string }> {
    const payload = {
      sub: userID,
      email: email,
      name: name,
    };

    const options = {
      expiresIn: this.config.get('JWT_EXPIRATION') ?? '30m',
      secret: this.config.get('JWT_SECRET'),
    };

    const token = await this.jwt.signAsync(payload, options);

    return {
      access_token: token,
    };
  }
}
