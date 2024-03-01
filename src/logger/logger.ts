import pino from "pino";
import pretty from "pino-pretty";

class LoggerUtil {
    /**
     * How much output is required?
     */
    private static LOG_LEVEL = process.env.LOG_LEVEL;
    /**
     * Save output to file (if true), else it is printed to console
     */
    private static SAVE_LOG_TO_FILE: boolean = this.stringToBoolean(process.env.SAVE_LOG_TO_FILE);
    /**
     * For customizing the output format
     */
    private static stream = pretty({
        colorize: true,
        colorizeObjects: false,
        singleLine: true,
    });
    /**
     * Helper for writing to files
     */
    private static fs = require("fs");
    /**
     * Directory and path for the log file, only used when SAVE_LOG_TO_FILE is true
     */
    private static logsDirectory = "./logs/";
    private static logFilePath = this.logsDirectory + "log.txt";

    constructor() {}

    /**
     * Creates the necessary folder and file for logging.
     * Do this only if logging is activated.
     */
    static setupLogFiles() {
        if (this.SAVE_LOG_TO_FILE) {
            //Create a new logging directory if not existing
            if (!this.fs.existsSync(this.logsDirectory)) {
                this.fs.mkdirSync(this.logsDirectory);
            }

            //Create the file
            this.fs.writeFile(this.logFilePath, "", (err: Error) => {
                if (err) {
                    console.error("Error in Logger can't writing to file:", err);
                } else {
                    console.log("File for Logger created successfully.");
                }
            });
        }
    }

    private static transport = pino.transport({
        targets: [
            {
                level: LoggerUtil.LOG_LEVEL,
                target: "pino/file",
                options: this.SAVE_LOG_TO_FILE ? { destination: this.logFilePath } : "", //Only access file if required
            },
        ],
    });

    private static logger = pino(this.transport, this.stream);

    static stringToBoolean(value: string | undefined): boolean {
        return value?.toLowerCase() === "true" || false;
    }

    static logInfo(endpoint: string, params?: object | string) {
        this.logger.info({ params }, `[${endpoint}]`);
    }

    static logDebug(endpoint: string, message?: string) {
        this.logger.debug(`[${endpoint}] ${message || ""}`);
    }

    static logError(endpoint: string, error: Error) {
        this.logger.error(`[${endpoint}] An error occurred: ${error.message}`, error);
    }
}

//Create the necessary folders and files
LoggerUtil.setupLogFiles();
export default LoggerUtil;
