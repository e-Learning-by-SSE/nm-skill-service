import { Transform, plainToInstance } from "class-transformer";
import {
    IsBoolean,
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Max,
    Min,
    validateSync,
} from "class-validator";

/**
 * Validation Schema for the configuration file.
 * Based on: https://docs.nestjs.com/techniques/configuration#custom-validate-function
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 * @author Carsten Wenzel  <wenzel@sse.uni-hildesheim.de>
 */

export enum DB_ACTION {
    DEMO_SEED = "DEMO_SEED",
    INIT = "INIT",
    RESET = "RESET",
    MIGRATE = "MIGRATE",
}

export enum LOG_ACTION {
    DEBUG = "debug",
    ERROR = "error",
    FATAL = "fatal",
    INFO = "info",
    TRACE = "trace",
    WARN = "warn",
}

export class EnvironmentVariables {
    // App Configuration
    @IsNotEmpty()
    @IsNumber()
    APP_PORT: number;

    // Database Configuration
    @IsNotEmpty()
    DB_USER: string;

    @IsNotEmpty()
    DB_PASSWORD: string;

    @IsNotEmpty()
    DB_HOST: string;

    @IsNotEmpty()
    @IsNumber()
    DB_PORT: number;

    @IsNotEmpty()
    DB_DATABASE: string;

    @IsNotEmpty()
    SEARCH_USER_PASSWORD: string;

    @IsNotEmpty()
    CLIENT_SECRET: string;

    @IsNotEmpty()
    DB_URL: string =
        "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=public";

    @IsEnum(DB_ACTION)
    @IsNotEmpty()
    DB_ACTION: DB_ACTION;

    @IsEnum(LOG_ACTION)
    @IsNotEmpty()
    LOG_LEVEL: string;

    @IsDefined()
    @Transform(({ value }) => (value === "true" ? true : value === "false" ? false : value))
    @IsBoolean()
    SAVE_LOG_TO_FILE: string;

    @IsNumber()
    @IsNotEmpty()
    @Max(1)
    @Min(0)
    PASSING_THRESHOLD: number;

    @IsNotEmpty()
    BERUFENET_CLIENT_SECRET: string;

    @IsUrl()
    @IsNotEmpty()
    BERUFENET_BASEURL: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    BERUFENET_TIMEOUT: number = 120000;

    @IsString()
    @IsOptional()
    MAX_PAYLOAD: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
