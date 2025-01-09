import { Request, Response } from 'express';
import morgan, { StreamOptions } from 'morgan';
import config from './config';
import logger from './logger';

morgan.token('message', (req: Request, res: Response): string => res.locals['errorMessage'] || '');

const getIpFormat = (): string => (config.env === 'production' ? ':remote-addr - ' : '');

const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successStream: StreamOptions = {
  write: (message: string) => logger.info(message.trim()),
};

const errorStream: StreamOptions = {
  write: (message: string) => logger.error(message.trim()),
};

export const successHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream: successStream,
});

export const errorHandler = morgan(errorResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream: errorStream,
});
