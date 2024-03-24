import morgan from 'morgan';
import { utcToZonedTime, format } from 'date-fns-tz';

import winstonLogger from './logger.config';

morgan.token('date-ko', (_req, _res, _tz) => {
  const timeZone = process.env['TZ'] ?? 'Asia/Seoul';
  const date = new Date();
  const zonedDate = utcToZonedTime(date, timeZone);
  const formatStr = 'yyyy-MM-dd HH:mm:ss.SSS';

  return format(zonedDate, formatStr, { timeZone });
});

export const LOGGER_COLOR = {
  BLACK: 0,
  RED: 31,
  GREEN: 32,
  YELLOW: 33,
  BLUE: 34,
  MAGENTA: 35,
  CYAN: 36,
};

export const colorize = (color: number, target: string | undefined | number) => {
  return `\x1b[${color}m${target}\x1b[0m`;
};

export const colorizeStatus = (status: number) => {
  let color;

  if (status >= 500) {
    color = LOGGER_COLOR.RED; // server error
  } else if (status >= 400) {
    color = LOGGER_COLOR.YELLOW; // client error
  } else if (status >= 300) {
    color = LOGGER_COLOR.CYAN; // redirection
  } else if (status >= 200) {
    color = LOGGER_COLOR.GREEN; // success
  } else {
    color = LOGGER_COLOR.BLACK; // no color
  }

  return colorize(color, status);
};

const logger = morgan(
  (tokens, req, res) => {
    return [
      colorize(LOGGER_COLOR.BLUE, tokens['remote-addr']?.(req, res)),
      '-',
      colorize(LOGGER_COLOR.YELLOW, tokens['method']?.(req, res)),
      colorize(LOGGER_COLOR.CYAN, tokens['url']?.(req, res)),
      colorize(LOGGER_COLOR.YELLOW, `HTTP/${tokens['http-version']?.(req, res)}`),
      colorize(LOGGER_COLOR.GREEN, tokens['status']?.(req, res)),
      colorize(LOGGER_COLOR.BLACK, `"${tokens['user-agent']?.(req, res)}"`),
      '-',
      colorize(LOGGER_COLOR.BLACK, `${tokens['response-time']?.(req, res)} ms, ${tokens['date-ko']?.(req, res)}`),
    ].join(' ');
  },
  {
    stream: {
      write: message => {
        const statusCode = Number(message.split(' ')[5]?.slice(5, 8));

        if (statusCode >= 400) {
          winstonLogger.error(message);
        } else if (statusCode >= 300) {
          winstonLogger.warn(message);
        } else if (statusCode >= 200) {
          winstonLogger.info(message);
        } else if (statusCode >= 100) {
          winstonLogger.info(message);
        } else {
          winstonLogger.debug(message);
        }
      },
    },
  },
);

export default logger;
