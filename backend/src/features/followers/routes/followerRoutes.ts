import { Add } from '@follower/controllers/follower-user';
import { authMiddleware } from '@global/helpers/auth.middleware';
import express, { Router } from 'express';

class FollwerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, Add.prototype.follower);

    return this.router;
  }
}

export const follwerRoutes: FollwerRoutes = new FollwerRoutes();
