import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { BerufeService } from "./berufeNetClient.service";

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
        return this.berufeNetService.getAllJobsBySearchString(searchString);
    }
    @Get("getJobByID")
    getJobsByI(@Query("JobBerufID") jobId: string) {
        return this.berufeNetService.getJobsByID(jobId);
    }
    @Get("saveJobsToLocalDB")
    getAllJobs() {
        return this.berufeNetService.getAllJobs();
    }
    @Get("getJobsByPage")
    getAllJobsStartWith(@Query("page") page: string) {
        return this.berufeNetService.getALLJobsByPage(page);
    }
    @Get("getCompetenciesByJobId")
    getCompetenciesByJobId(@Query("jobId") jobId: string) {
        return this.berufeNetService.getCompetenciesByJobID(jobId);
    }
    @Get("getDigitalCompetenciesByJobId")
    getDigitalCompetenciesByJobId(@Query("jobId") jobId: string) {
        return this.berufeNetService.getDigitalCompetenciesByJobID(jobId);
    }
}
