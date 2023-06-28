import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserCreationDto } from './dto';

import { UserMgmtService } from './user.service';
import { RoleGroupCreationDto } from './dto/roleGroup-creation.dto';
import { CompanyCreationDto } from './dto/company-creation.dto';
import { LearningProfileCreationDto } from './dto/learningProfile-creation.dto';
import { SkillProfileCreationDto } from './dto/skillProfil-creation.dto';

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
   * Creates a new user returns the created user.
   * @param dto The user description
   * @returns The created user.
   */
  @Post('add_user')
  addUser(@Body() dto: UserCreationDto) {
    return this.userService.createUser(dto);
  }

  @Post('add_company')
  addCompany(@Body() dto: CompanyCreationDto) {
    return this.userService.createComp(dto);
  }

  @Post('add_roleGroup')
  addroleGroup(@Body() dto: RoleGroupCreationDto) {
    return this.userService.createRoleGroup(dto);
  }

  @Post('add_learningProfile')
  addLearningProfile(@Body() dto: LearningProfileCreationDto) {
    return this.userService.createLP(dto);
  }
  @Post('add_skillProfile')
  addSkillProfile(@Body() dto: SkillProfileCreationDto) {
    return this.userService.createSP(dto);
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
