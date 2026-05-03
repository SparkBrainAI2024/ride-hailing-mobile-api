export interface AppEnv {
  DB_CONNECTION_URL: string;
  APP_ENV: 'test' | 'development' | 'production' | string;
  JWT_SECRET_KEY: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: string;
  ACCESS_TOKEN_LIFE: string;
  REFRESH_TOKEN_LIFE: string;
  RESET_PASSWORD_TOKEN_LIFE: string;
}

export default (): AppEnv => ({
  DB_CONNECTION_URL: process.env.DB_CONNECTION_URL || 'mongodb://localhost:27017/ride_hailing',
  APP_ENV: process.env.APP_ENV || 'development',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',
  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE || '5d',
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE || '30d',
  RESET_PASSWORD_TOKEN_LIFE: process.env.RESET_PASSWORD_TOKEN_LIFE || '10m',
});
