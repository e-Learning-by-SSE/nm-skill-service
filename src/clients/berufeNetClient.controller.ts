import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { BerufeService } from "./berufeNetClient.service";

@ApiTags("BerufeNet")
@Controller("berufeNet")
export class BerufeNetController {
    constructor(private berufeNetService: BerufeService) {
       
        
    }

    /**
     * Getting Job Description by search string .
     * @param beruf The search string
     * @returns job descritiopns.
     */
    @Get("getBerufeBySearchString")
    getBerufeBySearchString(@Query("searchString") searchString: string) {
        return this.berufeNetService.getAllBerufeBySearchString(searchString);
    }
    @Get("getBerufeByID")
    getBerufeByI(@Query("BerufID") berufId: string) {
        return this.berufeNetService.getBerufeByID(berufId);
    }
    @Get()
    getAllBerufe() {
        return this.berufeNetService.getAllBerufe();
    }
    @Get("bypage")
    getAllBerufeStartWith(@Query("page") page: string) {
        return this.berufeNetService.getALLBerufeByPage(page);
    }
}
