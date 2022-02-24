import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf } = winston.format;

const productionTransports: winston.transport[] = [
  new winston.transports.DailyRotateFile({
    dirname: "logs",
    filename: "combined-%DATE%.log",
    level: "info",
    maxFiles: "5d",
    maxSize: "10m",
    zippedArchive: true,
  }),
  new winston.transports.DailyRotateFile({
    dirname: "logs",
    filename: "error-%DATE%.log",
    level: "error",
    maxFiles: "5d",
    maxSize: "10m",
    zippedArchive: true,
  }),
];

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    printf(
      ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
    )
  ),
});

if (process.env.NODE_ENV !== "production")
  logger.add(new winston.transports.Console());
else if (process.env.NODE_ENV === "production")
  productionTransports.forEach((trans) => logger.add(trans));

export default logger;
