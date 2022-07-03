import * as winston from 'winston';

export const logger = winston.createLogger({
    format: winston.format.simple(),
    level: 'info',
    transports: [new winston.transports.Console()],
});
