import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UserCreationDto } from "./dto";

import { UserMgmtService } from "./user.service";

<<<<<<< HEAD
import { CompanyCreationDto } from './dto/company-creation.dto';
import { LearningProfileCreationDto } from './dto/learningProfile-creation.dto';
import { CareerProfileCreationDto } from './dto/careerProfile-creation.dto';
import { QualificationCreationDto } from './dto/qualification-creation.dto';
import { JobCreationDto } from './dto/job-creation.dto';
import { LearningHistoryCreationDto } from './dto/learningHistory-creation.dto';
=======
import { CompanyCreationDto } from "./dto/company-creation.dto";
import { LearningProfileCreationDto } from "./dto/learningProfile-creation.dto";
import { SkillProfileCreationDto } from "./dto/skillProfil-creation.dto";
import { QualificationCreationDto } from "./dto/qualification-creation.dto";
import { CreateLearningProgressDto } from "./dto/learningProgress-creation.dto";
>>>>>>> b8cf74c710f60e069ae598931e557b6982f7d825

@ApiTags("User")
@Controller("users")
export class UserMgmtController {
    constructor(private userService: UserMgmtService) {}

    /**
   * Lists all users.
   
   * @returns List of all users.
   */
    @Get("showAllUser")
    listUsers() {
        return this.userService.loadAllUsers();
    }

    /**
     * Creates a new user returns the created user.
     * @param dto The user description
     * @returns The created user.
     */
    @Post("add_user")
    addUser(@Body() dto: UserCreationDto) {
        return this.userService.createUser(dto);
    }

    @Post("add_company")
    addCompany(@Body() dto: CompanyCreationDto) {
        return this.userService.createComp(dto);
    }

    @Post("add_learningProfile")
    addLearningProfile(@Body() dto: LearningProfileCreationDto) {
        return this.userService.createLP(dto);
    }
    @Post("add_skillProfile")
    addSkillProfile(@Body() dto: SkillProfileCreationDto) {
        return this.userService.createSP(dto);
    }
    @Post("add_Qualification")
    addQualification(@Body() dto: QualificationCreationDto) {
        return this.userService.createQualification(dto);
    }
    /**
     * Returns the specified user.
     * @param userId The ID of the user, that shall be returned
     * @returns The specified user.
     */
    @Get(":userId")
    getUser(@Param("userId") userId: string) {
        return this.userService.getUser(userId);
    }

    @Get(":userId2")
    getUser2(@Param("userId2") userId2: string) {
        return this.userService.getUser(userId2);
    }

<<<<<<< HEAD
  @Post('add_learningProfile')
  addLearningProfile(@Body() dto: LearningProfileCreationDto) {
    return this.userService.createLP(dto);
  }
  @Post('add_careerProfile')
  addCareerProfile(@Body() dto: CareerProfileCreationDto) {
    return this.userService.createCP(dto);
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
=======
    @Get(":id/learning-progress")
    async getUserLearningProgress(@Param("id") id: string) {
        // Fetch a user's learning progress by user ID
        return this.userService.findProgressForUserId(id);
    }
>>>>>>> b8cf74c710f60e069ae598931e557b6982f7d825

    @Post(":id/learning-progress")
    async createLearningProgress(
        @Param("id") userId: string,
        @Body() createLearningProgressDto: CreateLearningProgressDto,
    ) {
        // Create a new learning progress entry for a user
        return this.userService.createProgressForUserId(userId, createLearningProgressDto);
    }

    @Delete(":id/learning-progress")
    async deleteLearningProgress(@Param("id") progressId: string) {
        return this.userService.deleteProgressForId(progressId);
    }

    /*  @Put(':id/learning-progress')
  async updateLearningProfile(
    @Param('id') userId: string,
    @Body() updateLearningProgressDto: UpdateLearningProgressDto,
  ) {
    // Update a user's learning profile
    return this.userService.updateLearningProgress(userId, updateLearningProgressDto);
  }*/
}
