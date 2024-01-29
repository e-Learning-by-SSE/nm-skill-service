import { Controller, Get, Post, Body, Param, Delete, Patch, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CareerProfileService } from "./careerProfile.service";
import { CareerProfileCreationDto } from "./dto/careerProfile-creation.dto";
import { CareerProfileFilterDto} from "./dto/careerProfile-filter.dto";


import { JobCreationDto} from "../user/dto/job-creation.dto";
import { JobUpdateDto} from "../user/dto/job-update.dto";

import { QualificationCreationDto} from "../user/dto/qualification-creation.dto";


@ApiTags("CareerProfile")
@Controller("")

export class CareerProfileController {
    constructor(private careerProfileService: CareerProfileService) {}

@Post("add_CareerProfile")
addCareerProfile(@Body() dto: CareerProfileCreationDto) {
    return this.careerProfileService.createCareerProfile(dto);
}

    // Filter: Includes careerProfile.dto.ts
    @Get("/career-profiles/")
    @ApiQuery({
        name: "userId",
        required: false,
        type: String,
        description: "Filter by userId",
    })
    getCareerProfileByFilter(@Query() filter: CareerProfileFilterDto) {
        return this.careerProfileService.getCareerProfileByFilter(filter);
    }

    @Get("/career-profiles/:career_profile_id")
    getCareerProfileByID(@Param("career_profile_id") careerProfileId: string) {
        return this.careerProfileService.getCareerProfileByID(careerProfileId);
    }

    @Delete("/career-profiles/:career_profile_id")
    delCareerProfileByID(@Param("career_profile_id") careerProfileId: string) {
        return this.careerProfileService.deleteCareerProfileByID(careerProfileId);
    }

    @Patch("/career-profiles/:career_profile_id")
    patchCareerProfileByID(
        @Param("career_profile_id") careerProfileId: string,
        
        @Body() dto: CareerProfileCreationDto
    ) {
        return this.careerProfileService.patchCareerProfileByID(careerProfileId, dto);
    }
    @Post("/career-profiles/:career_profile_id/job_history")
    addJob(@Param("career_profile_id") careerProfileId: string, @Body() dto: JobCreationDto) {
        return this.careerProfileService.createJob(careerProfileId, dto);
    }
    @Patch("/career-profiles/:career_profile_id/:job_history_id")
    patchJobHistoryAtCareerProfileByID(
        @Param("career_profile_id") careerProfileId: string,
        @Param("job_history_id") jobHistoryId: string,
        @Body() dto: JobUpdateDto,
    ) {
        return this.careerProfileService.patchJobHistoryAtCareerProfileByID(
            careerProfileId,
            jobHistoryId,
            dto,
        );
    }
    @Delete("/career-profiles/:career_profile_id/:job_history_id")
    deleteJobHistoryAtCareerProfileByID(
        @Param("career_profile_id") careerProfileId: string,
        @Param("job_history_id") jobHistoryId: string,
    ) {
        return this.careerProfileService.deleteJobHistoryAtCareerProfileByID(careerProfileId, jobHistoryId);
    }

    @Post("/career-profiles/:career_profile_id/qualifications/")
    addQualificationToCareerProfile(
        @Param("career_profile_id") careerProfileId: string,
        @Body() dto: QualificationCreationDto,
    ) {
        return this.careerProfileService.createQualificationForCareerProfile(careerProfileId, dto);
    }

    @Get("/career-profiles/:career_profile_id/qualifications/:qualification_id")
    getQualificationForCareerProfile(@Param("qualification_id") qualificationId: string) {
        return this.careerProfileService.getQualificationForCareerProfile(qualificationId);
    }

    @Patch("/career-profiles/:career_profile_id/qualifications/:qualification_id")
    patchQualificationToCareerProfile(
        @Param("career_profile_id") careerProfileId: string,
        @Param("qualification_id") qualificationId: string,
        @Body() dto: QualificationCreationDto,
    ) {
        return this.careerProfileService.patchQualificationForCareerProfile(
            careerProfileId,
            qualificationId,
            dto,
        );
    }
    
    @Delete("/career-profiles/:career_profile_id/qualifications/:qualification_id")
    deleteQualificationToCareerProfile(
        @Param("career_profile_id") careerProfileId: string,
        @Param("qualification_id") qualificationId: string,
    ) {
        return this.careerProfileService.deleteQualificationForCareerProfile(
            careerProfileId,
            qualificationId,
        );
    }

}