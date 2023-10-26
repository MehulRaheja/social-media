import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
// @socket.io/redis-adapter: if a user who was connected to socket and connects again then this library will maintain the connection
import Logger from 'bunyan';
import 'express-async-errors';
import { config } from '@root/config';
import applicationRoutes from '@root/routes';
import { CustomError, IErrorResponse } from '@global/helpers/error-handler';
import { SocketIOPostHandler } from '@socket/post';
import { SocketIOFollowerHandler } from '@socket/follower';
import { SocketIOUserHandler } from '@socket/user';

const SERVER_PORT = 5000;
const log: Logger = config.createLogger('server'); // whenever we see log/error with the name server, means it is coming from server file.

export class ChattyServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  // All the private methods will be called inside this function
  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session', // while applying load-balancer on aws this name will be required
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!], // ! will remove the error
        maxAge: 24 * 7 * 3600000, // cookie will be valid for 7 days
        secure: config.NODE_ENV !== 'development' // false means it can be used for http as well, it's okay for local environment
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL, // later '*' will be replaced client url
        credentials: true, // to use cookie, set this to true
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  // Global error handler to handle entire application's errors and send it to client
  private globalErrorHandler(app: Application): void {
    // finding url related errors for all the routes

    // throwing error when requested url is not found
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });

    // if it relates to any error class which is created extending CustomError class then this method will throw that error
    // we put _ in front of req because we are not using it
    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.error(error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnetions(socketIO);
    } catch (error) {
      log.error(error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    // create socket instance
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });

    // create redis client
    const pubClient = createClient({ url: config.REDIS_CLIENT }); // this will create client for publishing
    const subClient = pubClient.duplicate(); // this will create client for subscription
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    log.info(`Server has started with process ${process.pid}`);

    httpServer.listen(SERVER_PORT, () => {
      log.info(`Server running on port ${SERVER_PORT}`);
    });
  }

  // every socket connection we'll create will be define here
  private socketIOConnetions(io: Server): void {
    const postSocketHandler: SocketIOPostHandler = new SocketIOPostHandler(io);
    const followerSocketHandler: SocketIOFollowerHandler = new SocketIOFollowerHandler(io);
    const userSocketHandler: SocketIOUserHandler = new SocketIOUserHandler(io);

    postSocketHandler.listen();
    followerSocketHandler.listen();
    userSocketHandler.listen();
  }
}
