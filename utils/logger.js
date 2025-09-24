const pino = require("pino");

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      singleLine: true,
      ignore: "pid, hostname, req.headers",
      messageFormat: (log, mesageKey) => {
        const timestamp = new Date(log.time).toISOString();
        const levelString = pino.levels.labels[log.level].toUpperCase();
        const requestId = log.requestId || "";
        const filename = log.filename || "";
        const lineNumber = log.lineNumber || "";
        const message = log[mesageKey] || "";

        return `${timestamp} - ${requestId} - ${filename} : ${lineNumber} - [${levelString}] -> ${message}`
      }

    },
  },
  level: process.env.LOG_LEVEL || "INFO",
});

module.exports = logger;
