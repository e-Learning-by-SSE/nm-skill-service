import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
    colorize: true,
    colorizeObjects: false,
    singleLine: true,
});

class LoggerUtil {
    private static MIN_LOG_LEVEL = process.env.MIN_LOG_LEVEL;
    private static MAX_LOG_LEVEL = process.env.MAX_LOG_LEVEL;
    private static SAVE_LOG_TO_FILE: boolean = LoggerUtil.stringToBoolean(process.env.SAVE_LOG_TO_FILE);
    
    private static transport = pino.transport({
        targets: [ {
          
          target: 'pino/file',
          options: { destination: 'log.txt' }
        }]
      })
      
      private static logger = pino(this.SAVE_LOG_TO_FILE ? this.transport:{ level: "debug" }, stream);
    constructor(){
        
        
    }  
    

    static stringToBoolean(value: string | undefined): boolean {
        return value?.toLowerCase() === "true" || false;
    }

    static logInfo(endpoint: string, message?: string) {
        this.logger.info(`[${endpoint}] ${message || ""}`);
    }

    static logDebug(endpoint: string, message?: string) {
        this.logger.debug(`[${endpoint}] ${message || ""}`);
    }

    static logError(endpoint: string, error: Error) {
        this.logger.error(`[${endpoint}] An error occurred: ${error.message}`, error);
    }
}

export default LoggerUtil;
