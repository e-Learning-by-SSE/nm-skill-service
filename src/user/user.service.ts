import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import { UserCreationDto, UserDto, UserListDto } from './dto';

/**
 * Service that manages the creation/update/deletion Users
 * @author Wenzel
 */
@Injectable()
export class UserMgmtService {
  constructor(private db: PrismaService) {}

  /**
   * Adds a new user
   * @param dto Specifies the user to be created
   * @returns The newly created user

   */
  async createUser(dto: UserCreationDto) {
    // Create and return user
    try {
      const user = await this.db.user.create({
        data: {
          name: dto.name,
         
        },
      });

      return UserDto.createFromDao(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
      throw error;
    }
  }

  private async loadUser(userId: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Specified user not found: ' + userId);
    }

    return user;
  }

  public async getUser(userId: string) {
    const dao = await this.loadUser(userId);

    if (!dao) {
      throw new NotFoundException(`Specified user not found: ${userId}`);
    }

    return UserDto.createFromDao(dao);
  }

  public async loadAllUsers() {
    const users = await this.db.user.findMany();

    if (!users) {
      throw new NotFoundException('Can not find any users');
    }

    const userList = new UserListDto();
    userList.users = users.map((user) => UserDto.createFromDao(user));

    return users;
  }
}
