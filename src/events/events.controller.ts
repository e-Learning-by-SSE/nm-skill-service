import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MLSEvent } from "../events/dtos/mls-event.dto";
import { EventMgmtService } from "./events.service";
import LoggerUtil from "../logger/logger";

@ApiTags("Events")
@Controller("events")
export class EventsController {
    constructor(private eventService: EventMgmtService) {}
    @Post("")
    async getEvents(@Body() dto: MLSEvent) {
        LoggerUtil.logInfo("EventsController::getEvents", { request: dto });
        const result = await this.eventService.getEvent(dto);
        LoggerUtil.logInfo("EventsController::getEvents", { response: result });
        return result;
    }
}
