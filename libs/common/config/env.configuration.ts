export interface AppEnv {
  DB_CONNECTION_URL: string;
}

export default (): AppEnv => ({
  DB_CONNECTION_URL: process.env.DB_CONNECTION_URL || 'mongodb://localhost:27017/ride_hailing',
});
