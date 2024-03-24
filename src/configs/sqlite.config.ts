import { path as root } from 'app-root-path';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';

import logger from './logger.config';

export let seq: Sequelize;

export const connectSqlite = async () => {
  try {
    logger.info('🔌 Connecting to Sqlite...');

    seq = new Sequelize({
      dialect: 'sqlite',
      storage: join(root, 'data.db'),
      logging: msg => logger.debug(msg),
      define: {
        paranoid: true,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
      },
    });

    await seq.authenticate();

    logger.info('✨ Connected to Sqlite');

    return seq;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
