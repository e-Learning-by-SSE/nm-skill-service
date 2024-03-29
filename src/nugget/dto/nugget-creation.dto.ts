import { ApiProperty } from "@nestjs/swagger";
import { NuggetCategory } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsUrl } from "class-validator";

/**
 * Creates a new Nugget
 */
export class NuggetCreationDto {
    @IsNotEmpty()
    language: string;

    @IsNotEmpty()
    @IsUrl()
    resource: string;

    @IsNotEmpty()
    processingTime: string;

    @ApiProperty({
        enum: NuggetCategory,
        isArray: true,
        example: [
            NuggetCategory.ANALYZE,
            NuggetCategory.CONTENT,
            NuggetCategory.EXAMPLE,
            NuggetCategory.EXERCISE,
            NuggetCategory.INTRODUCTION,
            NuggetCategory.TEST,
        ],
    })
    @IsNotEmpty()
    isTypeOf: NuggetCategory;

    @IsOptional()
    presenter?: string;

    @IsOptional()
    mediatype?: string;

    constructor(
        language: string,
        resource: string,
        processingTime: string,
        isTypeOf: NuggetCategory,
        presenter: string | null,
        mediatype: string | null,
    ) {
        this.language = language;
        this.resource = resource;
        this.processingTime = processingTime;
        this.isTypeOf = isTypeOf;
        this.presenter = presenter ?? undefined;
        this.mediatype = mediatype ?? undefined;
    }
}
