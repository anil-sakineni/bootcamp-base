const pino = require("pino");
const pretty = require("pino-pretty");

const stream = pretty({
  colorize: true,
  singleLine: true,
  messageFormat: (log) => {
    const timestamp = new Date(log.time).toISOString();
    const levelString = pino.levels.labels[log.level].toUpperCase();
    const requestId = log.reqId || "";
    const message = log.msg || "";

    return `${timestamp} - ${requestId} - [${levelString}] -> ${message}`;
  },
});

const baseLogger = pino(
  {
    level: (process.env.LOG_LEVEL || "debug").toLowerCase(),
    base: null,
  },
  stream
);

// Wrapper
const logger = {
  info: (msg, reqId = "") => baseLogger.info({ msg, reqId }),
  error: (msg, reqId = "") => baseLogger.error({ msg, reqId }),
  warn: (msg, reqId = "") => baseLogger.warn({ msg, reqId }),
  debug: (msg, reqId = "") => baseLogger.debug({ msg, reqId }),
};

module.exports = logger;
