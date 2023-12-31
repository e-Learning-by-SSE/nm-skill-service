import pino from "pino";
import pretty from "pino-pretty";

import path from "path";
var fs = require("fs");

function fileExists(filePath: string) {
    try {
        return fs.statSync(filePath)();
    } catch (err) {
        return false;
    }
}
const logsDirectory = "./logs/";

const logFilePath = logsDirectory + "log.txt";
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
  }

if (!fileExists(logFilePath)) {
    fs.writeFile(logFilePath, "", (err:Error) => {
        if (err) {
            console.error("Error in Logger can't writing to file:", err);
        } else {
            console.log("File for Logger created successfully.");
        }
    });
}

const stream = pretty({
    colorize: true,
    colorizeObjects: false,
    singleLine: true,
});

class LoggerUtil {
    private static LOG_LEVEL = process.env.LOG_LEVEL;
    private static SAVE_LOG_TO_FILE: boolean = LoggerUtil.stringToBoolean(
        process.env.SAVE_LOG_TO_FILE,
    );

    private static transport = pino.transport({
        targets: [
            {
                level: LoggerUtil.LOG_LEVEL,

                target: "pino/file",
                options: { destination: logFilePath },
            },
        ],
    });

    private static logger = pino(
        this.SAVE_LOG_TO_FILE ? this.transport : { level: LoggerUtil.LOG_LEVEL },
        stream,
    );
    constructor() {}

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
