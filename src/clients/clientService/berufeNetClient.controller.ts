import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { BerufeService } from "./berufeNetClient.service";

@ApiTags("BerufeNet")
@Controller("berufeNet")
export class BerufeNetController {
    constructor(private berufeNetService: BerufeService) {
        const apiKey = "d672172b-f3ef-4746-b659-227c39d95acf";
        this.berufeNetService = new BerufeService(apiKey)
    }

    /**
     * Getting Job Description by search string .
     * @param beruf The search string 
     * @returns job descritiopns.
     */
    @Get('getBerufeBySearchString')
    getBerufeBySearchString(@Query("Beruf") beruf: string) {
        return this.berufeNetService.getAllBerufeBySearchString(beruf);
    }
    @Get('getBerufeByID')
    getBerufeByI(@Query("BerufID") berufId: string) {
        return this.berufeNetService.getBerufeByID(berufId);
    }
    @Get()
    getAllBerufe() {
        return this.berufeNetService.getAllBerufe();
    }
}
