import { config } from 'dotenv'
import { Dialect } from './types/dbConfig';
config()

//config for server port
export const envConfig = {
  portNumber: process.env.PORT,
}

//config for database
export const dbConfig = {
  db: process.env.DB_NAME || '',
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || '',
  dialect:Dialect.MYSQL,
  port: Number(process.env.DB_PORT) || 3306, // safely cast to number with fallback
  pool: {
    min: 0,
    max: 5,
    idle: 10000,
    acquire: 10000
  }
};
