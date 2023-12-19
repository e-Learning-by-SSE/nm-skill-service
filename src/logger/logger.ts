import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  colorize: true,
  colorizeObjects: false,
  singleLine: true,
});

const logger = pino({ level: 'debug' }, stream);

class LoggerUtil {
  static logInfo(endpoint: string, message?: string) {
    logger.info(`[${endpoint}] ${message || ''}`);
  }

  static logDebug(endpoint: string, message?: string) {
    logger.debug(`[${endpoint}] ${message || ''}`);
  }

  static logError(endpoint: string, error: Error) {
    logger.error(`[${endpoint}] An error occurred: ${error.message}`, error);
  }
}

export default LoggerUtil;