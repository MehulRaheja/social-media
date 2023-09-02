import { authRoutes } from '@auth/routes/authRoutes';
import { Application } from 'express';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    // routes will be defined here
    app.use(BASE_PATH, authRoutes.routes());
  };
  routes();
};
