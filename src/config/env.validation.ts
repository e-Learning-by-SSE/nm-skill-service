import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, validateSync } from 'class-validator';

/**
 * Validation Schema for the configuration file.
 * Based on: https://docs.nestjs.com/techniques/configuration#custom-validate-function
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 * @author Carsten Wenzel  <wenzel@sse.uni-hildesheim.de>
 */

export enum DB_ACTION {
  DEMO_SEED = 'DEMO_SEED',
  INIT = 'INIT',
  MIGRATE = 'MIGRATE'
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
  BASEURL_BERUFENET: string;

  @IsNotEmpty()
  CLIENT_SECRET_BERUFENET: string;

  @IsNotEmpty()
  DB_URL: string = 'postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=public';
  

  @IsEnum(DB_ACTION)
  @IsNotEmpty()
  DB_ACTION :DB_ACTION;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
