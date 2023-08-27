import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_CLIENT: string | undefined;

  private readonly DEFAULT_DATABASE_URL = 'mongodb+srv://filehandle:M6sVOhpQRRC7PpLz@cluster0.y6eg7.mongodb.net/social-media?retryWrites=true&w=majority'

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || '12345';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.REDIS_CLIENT = process.env.REDIS_CLIENT || '';
  }

  public validateConfig(): void {
    // this keyword refers to an object, it contains all the above properties as key-value pairs
    for(const [key, value] of Object.entries(this)) {
      if(value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }
};

export const config: Config = new Config();