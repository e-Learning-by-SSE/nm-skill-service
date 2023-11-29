import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { JobsService } from "./jobNetClient.service";

@ApiTags("JobsNet")
@Controller("jobsNet")
export class JobsNetController {
    constructor(private jobsNetService: JobsService) {
       
        
    }

    /**
     * Getting Job Description by search string .
     * @param job The search string
     * @returns job descritiopns.
     */
    @Get("getJobBySearchString")
    getJobsBySearchString(@Query("searchString") searchString: string) {
        return this.jobsNetService.getAllJobsBySearchString(searchString);
    }
    @Get("getJobByID")
    getJobsByI(@Query("JobBerufID") jobId: string) {
        return this.jobsNetService.getJobsByID(jobId);
    }
    @Get('saveJobsToLocalDB')
    getAllJobs() {
        return this.jobsNetService.getAllJobs();
    }
    @Get("getJobsByPage")
    getAllJobsStartWith(@Query("page") page: string) {
        return this.jobsNetService.getALLJobsByPage(page);
    }
    @Get("getCompetenciesByJobId")
    getCompetenciesByJobId(@Query("jobId") jobId: string) {
        return this.jobsNetService.getCompetenciesByJobID(jobId);
    }
    @Get("getDigitalCompetenciesByJobId")
    getDigitalCompetenciesByJobId(@Query("jobId") jobId: string) {
        return this.jobsNetService.getDigitalCompetenciesByJobID(jobId);
    }

}
