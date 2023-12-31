import mongoose from 'mongoose';
import Logger from 'bunyan';
import { config } from '@root/config';
import { redisConnetion } from '@service/redis/redis.connection';

const log: Logger = config.createLogger('setupDatabase'); // whenever we see log/error with the name setupDatabase, means it is coming from server file.

export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info('Successfully connected to database');
        redisConnetion.connect();
      })
      .catch((error) => {
        log.error('Error connecting to database', error);
        return process.exit(1); // to exit the current process, if connecting to db fails
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect); // If mongoose gets disconnected then it will try to connect again
};
