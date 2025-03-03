import winston from "winston";
import path from "path";

// Define custom log format to handle objects fully
const logFormat = winston.format.printf(
  ({ level, message, data, timestamp }) => {
    // If message is an object, stringify it fully. otherwise, use it as-is

    const logData =
      typeof data === "object" ? JSON.stringify(data, null, 2) : data;
    return `${timestamp} [${level.toUpperCase()}]: ${message} -  ${logData} \n
            ----------------------------------------------------------------\n
    `;
  }
);

// Create Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
  ),
  transports: [
    // Console transport for development
    /*  new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Apply color only to console
        logFormat
      ),
    }), */
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "combined.log"),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
      format: logFormat,
    }),
    // File transport for error logs
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
      format: logFormat,
    }),
  ],
});

export default logger;
