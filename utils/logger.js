
const pino = require("pino");
const pretty = require("pino-pretty");

const stream = pretty({
  colorize: true,
  singleLine: true,
  ignore: "pid,hostname,req.headers",
  messageFormat: (log, messageKey) => {
    const timestamp = new Date(log.time).toISOString();
    const levelString = pino.levels.labels[log.level].toUpperCase();
    const requestId = log.requestId || "";
    const filename = log.filename || "";
    const lineNumber = log.lineNumber || "";
    const message = log[messageKey] || "";

    return `${timestamp} - ${requestId} - ${filename} : ${lineNumber} - [${levelString}] -> ${message}`;
  }
});

const logger = pino(
  {
    level: (process.env.LOG_LEVEL || "info").toLowerCase(),
    base: null,
  },
  stream
);

module.exports = logger;
