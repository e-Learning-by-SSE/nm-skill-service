import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
    UserCreationDto,
    CompanyCreationDto,
    LearningProfileCreationDto,
    CreateLearningProgressDto,
    CareerProfileCreationDto,
    JobCreationDto,
    LearningHistoryCreationDto,
    
    
} from "./dto";
import { QualificationCreationDto } from "./dto/qualification-creation.dto";
import { UserMgmtService } from "./user.service";

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
    
    @ApiOperation({ summary: "Experimental (WIP)" })
    @Post("add_user")
    addUser(@Body() dto: UserCreationDto) {
        return this.userService.createUser(dto);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Post("add_company")
    addCompany(@Body() dto: CompanyCreationDto) {
        return this.userService.createComp(dto);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Post("add_learningProfile")
    addLearningProfile(@Body() dto: LearningProfileCreationDto) {
        return this.userService.createLP(dto);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Post("add_CareerProfile")
    addCareerProfile(@Body() dto: CareerProfileCreationDto) {
        return this.userService.createCP(dto);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Post("add_Qualification")
    addQualification(@Body() dto: QualificationCreationDto) {
        return this.userService.createQualification(dto);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Post("add_Job")
    addJob(@Body() dto: JobCreationDto) {
        return this.userService.createJob(dto);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Post("add_LearningHistory")
    addLearningHistory(@Body() dto: LearningHistoryCreationDto) {
        return this.userService.createLH(dto);
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

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Get(":id/learning-progress")
    async getUserLearningProgress(@Param("id") id: string) {
        // Fetch a user's learning progress by user ID
        return this.userService.findProgressForUserId(id);
    }

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
