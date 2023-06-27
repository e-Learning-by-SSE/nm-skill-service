import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserCreationDto } from './dto';

import { UserMgmtService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserMgmtController {
  constructor(private userService: UserMgmtService) {}

  /**
   * Lists all users.
   
   * @returns List of all users.
   */
  @Get('showAllUser')
  listUsers() {
    return this.userService.loadAllUsers();
  }

  /**
   * Creates a new user at the specified repository and returns the created user.
   * @param userId The owner of the repository
   * @param repositoryId The repository at which the user shall be added to.
   * @param dto The user description
   * @returns The created user.
   */
  @Post('add_user')
  addUser(@Body() dto: UserCreationDto) {
    return this.userService.createUser(dto);
  }

  /**
   * Returns the specified user.
   * @param userId The ID of the user, that shall be returned
   * @returns The specified user.
   */
  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }
}
