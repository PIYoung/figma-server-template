import logger from '../configs/logger.config';
import { LOGGER_COLOR, colorize } from '../configs/morgan.config';

/**
 * logger for sequelize.
 */
export const seqLogger = {
  error: (err: any) => {
    logger.error(`${colorize(LOGGER_COLOR.MAGENTA, '[SEQ ERROR STACK]')}: ${err?.stack}`);
    logger.error(`${colorize(LOGGER_COLOR.MAGENTA, '[SEQ ERROR NAME]')}: ${err?.name}`);
    logger.error(`${colorize(LOGGER_COLOR.MAGENTA, '[SEQ ERROR MESSAGE]')}: ${err?.original?.message}`);
    logger.error(`${colorize(LOGGER_COLOR.MAGENTA, '[SEQ ERROR SQL]')}: ${err?.sql}`);
  },
};
