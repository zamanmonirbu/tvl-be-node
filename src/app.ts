import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import mongoSanitize from 'express-mongo-sanitize';
import httpStatus from 'http-status';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';
import config from './config/config';
import { jwtStrategy } from './config/passport';
import { authLimiter } from './middlewares/rateLimiter';
import routes from './routes/v1';
import { successHandler, errorHandler as morganErroHandler } from './config/morgan';

const app: Express = express();

// Use morgan for logging if not in test environment
if (config.env !== 'test') {
  app.use(successHandler);
  app.use(morganErroHandler);
}

// Set security HTTP headers
app.use(helmet());

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize request data to prevent injection attacks
app.use(mongoSanitize());

// Gzip compression for better performance
app.use(compression());

// Enable CORS
app.use(cors());
app.options('*', cors());

// Initialize Passport for JWT authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Limit repeated failed requests to authentication endpoints in production
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// Mount API routes
app.use('/v1', routes);

// Handle 404 errors for unknown API endpoints
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert errors to ApiError instances if necessary
app.use(errorConverter);

// Handle errors globally
app.use(errorHandler);

export default app;
