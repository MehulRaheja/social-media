import express, { Express } from 'express';
import { ServerSetup } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from '@root/config';
import Logger from 'bunyan';
// start command in package.json script will start 5 instances with pm2 and if there is any change in code --watch flag will look into it and restart the server
// bunyan is also added to start script so we can see logs in production
// --attach will show logs in the terminal when we run the start script
const log: Logger = config.createLogger('app');

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection(); // connect to database first
    const app: Express = express();
    const server: ServerSetup = new ServerSetup(app);
    server.start();
    Application.handleExit(); // to handle exceptions through pm2
  }

  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }

  private static handleExit(): void {
    process.on('uncaughtException', (error: Error): void => {
      log.error(`There was an uncaught error: ${error}`);
      Application.shutDownProperly(1); // 1 is code for uncaughtException
    });

    process.on('unhandleRejection', (reason: Error): void => { // it is for the case where a promise is not handled correctly
      log.error(`Unhandled rejection at promise: ${reason}`);
      Application.shutDownProperly(2); // 2 is code for unhandle promise
    });

    process.on('SIGTERM', (): void => { // it is just a signal to terminate a process
      log.error('Caught SIGTERM');
      Application.shutDownProperly(2);
    });

    process.on('SIGINT', (): void => { // for signal intelligence
      log.error('Caught SIGINT');
      Application.shutDownProperly(2);
    });

    process.on('exit', (): void => { // if at any point the application is exited then this will log it. and we use pm2 in the background, so this will help us to start back our server
      log.error('Exiting');
    });
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        log.info('Shutdown complete');
        process.exit(exitCode);
      })
      .catch((error) => {
        log.error(`Error during shutdown: ${error}`);
        process.exit(1);
      });
  }
}

const application: Application = new Application();
application.initialize();
