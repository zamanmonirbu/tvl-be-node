import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './config/logger';

let server: import('http').Server;

// Connect to MongoDB and start the server
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info('Connected to MongoDB');
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch((err: any) => {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });

// Gracefully handle server shutdown
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// Handle unexpected errors
const unexpectedErrorHandler = (error: Error) => {
  logger.error(`Unexpected Error: ${error.message}`);
  exitHandler();
};

// Handle uncaught exceptions
process.on('uncaughtException', unexpectedErrorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  exitHandler();
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close(() => {
      logger.info('Server closed due to SIGTERM');
    });
  }
});
