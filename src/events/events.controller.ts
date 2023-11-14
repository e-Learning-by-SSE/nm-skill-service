import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiTags, ApiQuery } from "@nestjs/swagger"; // Import ApiQuery decorator




import { MLSEvent } from "../events/dtos/mls-event.dto";

import { LIFECYCLE } from "@prisma/client";
import { EventMgmtService } from "./events.service";

@ApiTags("Events")
@Controller("events")
export class EventsController {
    constructor(private eventService: EventMgmtService) {}
    @Post("/")
    getEvents(@Body() dto: MLSEvent) {
        return this.eventService.getEvent(dto);
    }
}