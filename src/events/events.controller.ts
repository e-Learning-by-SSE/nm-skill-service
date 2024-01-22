import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MLSEvent } from "../events/dtos/mls-event.dto";
import { EventMgmtService } from "./events.service";


@ApiTags("Events")
@Controller("events")
export class EventsController {
    constructor(private eventService: EventMgmtService) {}
    @ApiOperation({ summary: "Experimental (WIP)" })
    @Post("")
    getEvents(@Body() dto: MLSEvent) {
        console.log(dto);
        return this.eventService.getEvent(dto);
    }
}
