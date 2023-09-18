import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserCreationDto } from './dto';

import { UserMgmtService } from './user.service';

import { CompanyCreationDto } from './dto/company-creation.dto';
import { LearningProfileCreationDto } from './dto/learningProfile-creation.dto';
import { SkillProfileCreationDto } from './dto/skillProfil-creation.dto';
import { QualificationCreationDto } from './dto/qualification-creation.dto';
import { CreateLearningProgressDto } from './dto/learningProgress-creation.dto';
import { UpdateLearningProgressDto } from './dto/learningProgrss-update.dto';

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



  @Post('add_learningProfile')
  addLearningProfile(@Body() dto: LearningProfileCreationDto) {
    return this.userService.createLP(dto);
  }
  @Post('add_skillProfile')
  addSkillProfile(@Body() dto: SkillProfileCreationDto) {
    return this.userService.createSP(dto);
  }
  @Post('add_Qualification')
  addQualification(@Body() dto: QualificationCreationDto) {
    return this.userService.createQualification(dto);
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

    @Get(':userId2')
  getUser2(@Param('userId2') userId2: string) {
    return this.userService.getUser(userId2);
  }

  @Get(':id/learning-progress')
  async getUserLearningProgress(@Param('id') id: string) {
    // Fetch a user's learning progress by user ID
    return this.userService.findProgressForUserId(id);
  }

  @Post(':id/learning-progress')
  async createLearningProgress(
    @Param('id') userId: string,
    @Body() createLearningProgressDto: CreateLearningProgressDto,
  ) {
    // Create a new learning progress entry for a user
    return this.userService.createProgressForUserId(userId, createLearningProgressDto);
  }

  @Put(':id/learning-progress')
  async updateLearningProfile(
    @Param('id') userId: string,
    @Body() updateLearningProgressDto: UpdateLearningProgressDto,
  ) {
    // Update a user's learning profile
    return this.userService.updateLearningProgress(userId, updateLearningProgressDto);
  }
}
