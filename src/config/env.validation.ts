import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, validateSync } from 'class-validator';

/**
 * Validation Schema for the configuration file.
 * Based on: https://docs.nestjs.com/techniques/configuration#custom-validate-function
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 */
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
  DB_URL: string = 'postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=public';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
