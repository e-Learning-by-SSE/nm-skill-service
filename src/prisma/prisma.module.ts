import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

// Global decorator allows the usage of this module in all other modules without the need to edit all module specifications separately
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
