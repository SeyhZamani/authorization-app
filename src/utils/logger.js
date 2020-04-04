const path = require('path');
const moment = require('moment');
const httpContext = require('express-http-context');
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.colorize(),
        format.printf((info) => {
            const correlationId = httpContext.get('correlationId') || '###NO REQ ID###';
            return `${moment(info.timestamp).utc().format('YYYY-MM-DD HH:mm:ss')} ${correlationId} ${info.level} [${info.label}]: ${info.message}`;
        }),
    ),
    transports: [new transports.Console()],
});

module.exports = logger;
