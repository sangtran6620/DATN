import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { WinstonModuleOptions } from 'nest-winston';
import config from 'config';

const isProduction = process.env.NODE_ENV === 'production';
// const winstonConfig = config.get('winston');

export default {
  format: winston.format.colorize(),
  exitOnError: false,
  transports: new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      winston.format.errors({ stack: true }),
      nestWinstonModuleUtilities.format.nestLike('Logger', {
        prettyPrint: true,
      }),
    ),
  }),
} as WinstonModuleOptions;
