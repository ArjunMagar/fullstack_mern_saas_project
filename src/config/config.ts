import { config } from 'dotenv'
import { Dialect } from './types/dbConfig';
import ms from 'ms'
config()


export const envConfig= {
  jwtSecretKey: process.env.JWT_SECRET_KEY as string,     // type: string
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as ms.StringValue,     // type: stringValue like '20d'
  portNumber: Number(process.env.PORT),  
  clientID:process.env.GOOGLE_CLIENT_ID as string,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL:process.env.CALLBACK_URL  as string

};

//config for database
export const dbConfig = {
  db: process.env.DB_NAME ,
  username: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD ,
  host: process.env.DB_HOST,
  dialect: Dialect.MYSQL,
  port: Number(process.env.DB_PORT) || 3306, // safely cast to number with fallback
  pool: {
    min: 0,
    max: 5,
    idle: 10000,
    acquire: 10000
  }
};
