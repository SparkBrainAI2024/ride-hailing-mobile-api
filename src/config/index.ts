import * as dotenv from "dotenv";
dotenv.config();

export const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;
export const SUPPORT_EMAIL_AUTH = process.env.SUPPORT_EMAIL_AUTH;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE;
export const RESET_PASSWORD_TOKEN_LIFE = process.env.RESET_PASSWORD_TOKEN_LIFE;
export const REFRESH_TOKEN_LIFE = process.env.REFRESH_TOKEN_LIFE;
export const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_KEY = process.env.AWS_S3_SECRET_KEY;
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_S3_UPLOAD_PREFIX = process.env.AWS_S3_UPLOAD_PREFIX;
