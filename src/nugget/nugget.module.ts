import { Module } from "@nestjs/common";
import { NuggetMgmtController } from "./nugget.controller";
import { NuggetMgmtService } from "./nugget.service";

@Module({
    controllers: [NuggetMgmtController],
    providers: [NuggetMgmtService],
    exports: [NuggetMgmtService],
})
export class DynamicNuggetModuleModule {}
