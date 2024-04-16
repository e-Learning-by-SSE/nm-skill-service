import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { SkillModule } from "./skills/skill.module";
import { LearningPathModule } from "./learningPath/learningPath.module";
import { LearningUnitModule } from "./learningUnit/learningUnit.module";
import { validate } from "./config/env.validation";
import { PathFinderModule } from "./pathFinder/pathFinder.module";
import { UserModule } from "./user/user.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { EventsModule } from "./events/events.module";
import { ClientModule } from "./clients/client.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate,
            validationOptions: { allowUnknown: false },
        }),
        PrismaModule,
        SkillModule,
        LearningPathModule,
        LearningUnitModule,
        PathFinderModule,
        UserModule,
        FeedbackModule,
        EventsModule,
        ClientModule,
    ],
})
export class AppModule {}
