const winston = require('winston')

const format = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
)

const consoleTransport = new winston.transports.Console({})

const logger = winston.createLogger({
  format,
  transports: [consoleTransport]
})

module.exports = {
  logger
}
