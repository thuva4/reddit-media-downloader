const winston = require('winston')
const { TIME_ZONE } = require('./constants')

const timezoned = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: TIME_ZONE
  })
}

const format = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: timezoned }),
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
