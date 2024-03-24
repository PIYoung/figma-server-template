import { NextFunction, Request, Response } from 'express';

import logger from '../configs/logger.config';
import { LOGGER_COLOR, colorize } from '../configs/morgan.config';
import { STATUS_CODES } from '../constants';
import { ErrorResponse } from '../types';
import { HttpError } from '../errors/http-error';
import { getResponsePhrase } from '../utils';

export const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  if (!(err instanceof HttpError)) {
    const message = err.message || getResponsePhrase(STATUS_CODES.INTERNAL_SERVER_ERROR);
    err = new HttpError(STATUS_CODES.INTERNAL_SERVER_ERROR, message);
  }

  next(err);
};

export const errorHandler = (err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  const { headers = {}, query = {}, params = {}, body = {}, path = '', method = '' } = req;
  const status = err.statusCode || 500;
  const message = err.message || 'Unknown error occurred';
  const result: ErrorResponse = {
    result: false,
    message,
    data: {
      status,
      path,
      method,
      request: {
        headers,
        query,
        params,
        body,
      },
    },
  };

  logger.error(`${colorize(LOGGER_COLOR.MAGENTA, '[REQUEST ERROR DATA]')}: ${JSON.stringify(result)}`);
  logger.error(`${colorize(LOGGER_COLOR.MAGENTA, '[REQUEST ERROR STACK]')}: ${err.stack}`);

  res.status(status).json(result);
};
