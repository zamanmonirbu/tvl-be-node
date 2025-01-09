import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  skipSuccessfulRequests: true, // Skip requests with a successful response
});
