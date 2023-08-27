import mongoose from "mongoose";
import { config } from "./config";

export default () => {
  const connect = () => {
    mongoose.connect(`${config.DATABASE_URL}`)
      .then(() => {
        console.log('Successfully connected to database');
      })
      .catch((error) => {
        console.log('Error connecting to database', error);
        return process.exit(1); // to exit the current process, if connecting to db fails
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);  // If mongoose gets disconnected then it will try to connect again
};