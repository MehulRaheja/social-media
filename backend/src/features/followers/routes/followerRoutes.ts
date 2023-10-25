import { Add } from '@follower/controllers/follower-user';
import { Get } from '@follower/controllers/get-followers';
import { Remove } from '@follower/controllers/unfollow-user';
import { authMiddleware } from '@global/helpers/auth.middleware';
import express, { Router } from 'express';

class FollwerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/user/following', authMiddleware.checkAuthentication, Get.prototype.userFollowing);
    this.router.get('/user/followers/:userId', authMiddleware.checkAuthentication, Get.prototype.userFollowers);

    this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, Add.prototype.follower);
    this.router.put('/user/unfollow/:followeeId/:followerId', authMiddleware.checkAuthentication, Remove.prototype.follower);

    return this.router;
  }
}

export const follwerRoutes: FollwerRoutes = new FollwerRoutes();