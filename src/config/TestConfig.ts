import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';

/**
 * A ConfigServe that allows to override values for testing purposes.
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 */
export class TestConfig extends ConfigService {
  private config: ConfigService;
  private testConfig: Record<string, any> = {};

  constructor(config: ConfigService) {
    super();
    this.config = config;
  }

  public set(key: keyof EnvironmentVariables, value: any) {
    this.testConfig[key] = value;
  }

  public get(key: string) {
    return this.testConfig[key] ?? this.config.get(key);
  }
}
