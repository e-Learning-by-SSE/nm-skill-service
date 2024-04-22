import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { BerufeService } from "./berufeNetClient.service";
import LoggerUtil from "../logger/logger";

@ApiTags("BerufeNet")
@Controller("berufeNet")
export class BerufeNetController {
    constructor(private berufeNetService: BerufeService) {}

    /**
     * Getting Job Description by search string.
     * @param job The search string
     * @returns job descriptions.
     */
    @Get("getJobBySearchString")
    getJobsBySearchString(@Query("searchString") searchString: string) {
        LoggerUtil.logInfo("BerufeNetController::getJobsBySearchString", {
            searchString: searchString,
        });
        return this.berufeNetService.getAllJobsBySearchString(searchString);
    }

    @Get("getJobById")
    getJobsById(@Query("JobBerufId") jobId: string) {
        LoggerUtil.logInfo("BerufeNetController::getJobsById", {
            jobId: jobId,
        });
        return this.berufeNetService.getJobsByID(jobId);
    }

    @Get("saveJobsToLocalDB")
    getAllJobs() {
        LoggerUtil.logInfo("BerufeNetController::getAllJobs", {});
        return this.berufeNetService.getAllJobs();
    }

    @Get("getJobsByPage")
    getAllJobsStartWith(@Query("page") page: string) {
        LoggerUtil.logInfo("BerufeNetController::getAllJobsStartWith", {
            page: page,
        });
        return this.berufeNetService.getALLJobsByPage(page);
    }

    @Get("getCompetenciesByJobId")
    getCompetenciesByJobId(@Query("jobId") jobId: string) {
        LoggerUtil.logInfo("BerufeNetController::getCompetenciesByJobId", {
            jobId: jobId,
        });
        return this.berufeNetService.getCompetenciesByJobID(jobId);
    }

    @Get("getDigitalCompetenciesByJobId")
    getDigitalCompetenciesByJobId(@Query("jobId") jobId: string) {
        LoggerUtil.logInfo("BerufeNetController::getDigitalCompetenciesByJobId", {
            jobId: jobId,
        });
        return this.berufeNetService.getDigitalCompetenciesByJobID(jobId);
    }
}
