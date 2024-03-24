import logger from './configs/logger.config';
import { configDotenv } from './configs/dotenv.config';
import { connectSqlite } from './configs/sqlite.config';

/**
 * Displays the current memory usage of the Node.js process.
 * @returns A string representing the memory usage in human-readable format.
 */
const showMemoryUsage = () => {
  type Unit = keyof typeof convertBytesTo;

  const convertBytesTo = {
    KB: (bytes: number) => bytes / 1024, // 10^3 Bytes
    MB: (bytes: number) => convertBytesTo.KB(bytes) / 1024, // 10^6 Bytes
    GB: (bytes: number) => convertBytesTo.MB(bytes) / 1024, // 10^9 Bytes
  };
  const toHuman = (bytes: number, unit: Unit) => `${convertBytesTo[unit](bytes).toFixed(2)}${unit}`;
  const memory = process.memoryUsage();
  const usedHeap = toHuman(memory.heapUsed, 'MB');
  const totalHeap = toHuman(memory.heapTotal, 'MB');
  const rss = toHuman(memory.rss, 'MB'); // RSS: Resident Set Size

  return `Used ${usedHeap} of ${totalHeap} - RSS: ${rss}`;
};

/**
 * Initializes the application by setting up the server and connecting to the database.
 */
const bootstrap = async () => {
  // lazy import required to avoid dotenv config before it's loaded
  const app = (await import('./configs/express.config')).default;
  const port = Number(process.env['PORT']) || 3000;

  const seq = await connectSqlite();
  const server = app.listen(port, () => {
    logger.info(`🚀 Server is running at http://localhost:${port}`);
    logger.info(`🚀 Starting server... ${showMemoryUsage()}`);
  });

  // graceful shutdown
  const shutdown = async (signal: 'SIGINT' | 'SIGTERM') => {
    logger.info(`👻 Server is shutting down... ${signal}`);
    await seq.close();
    server.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown.bind(null, 'SIGINT'));
  process.on('SIGTERM', shutdown.bind(null, 'SIGTERM'));
};

configDotenv();
bootstrap();
