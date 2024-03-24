import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import loggerMorgan from './morgan.config';
import { errorConverter, errorHandler } from '../middlewares';
import { resourcePath } from '../utils';

const app = express();

app.use(compression());
app.use(cors({ origin: '*', credentials: true, optionsSuccessStatus: 200 }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:', "'localhost:*'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'"],
        scriptSrc: ["'self'"],
      },
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMorgan);

app.use('/resources', express.static(resourcePath));
app.use('/', (_req, res) => {
  res.status(200).send('<h1>Express + TypeScript Server</h1>');
});

app.use(errorConverter);
app.use(errorHandler);

export default app;
