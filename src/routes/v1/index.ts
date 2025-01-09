import express, { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import docsRoute from './docs.route';
import config from '../../config/config';

const router: Router = express.Router();

// Define the routes with type safety
interface Route {
  path: string;
  route: express.Router;
}

const defaultRoutes: Route[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
];

const devRoutes: Route[] = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

// Add default routes
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  // Add dev routes only in development mode
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
