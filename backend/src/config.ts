import dotenv from 'dotenv';
import bunyan from 'bunyan';
import cloudinary from 'cloudinary';

dotenv.config({});

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_CLIENT: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;

  private readonly DEFAULT_DATABASE_URL = 'mongodb+srv://filehandle:M6sVOhpQRRC7PpLz@cluster0.y6eg7.mongodb.net/social-media?retryWrites=true&w=majority';

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || '12345';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.REDIS_CLIENT = process.env.REDIS_CLIENT || '';
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
  }

  // in console name will be used as an identifier
  // | ./node_modules/.bin/bunyan (for mac)  is added to dev script in package.json to use this library for logging purposes
  // | .\\node_modules\\.bin\\bunyan (for windows)
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug'});
  }

  public validateConfig(): void {
    // this keyword refers to an object, it contains all the above properties as key-value pairs
    for(const [key, value] of Object.entries(this)) {
      if(value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }

  // to allow our application to access cloudinary we create a public method
  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET
    });
  }
};

export const config: Config = new Config();
