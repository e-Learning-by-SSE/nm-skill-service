import { Body, Controller, Post} from "@nestjs/common";
import { ApiTags} from "@nestjs/swagger";

import { MLSEvent } from "../events/dtos/mls-event.dto";
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