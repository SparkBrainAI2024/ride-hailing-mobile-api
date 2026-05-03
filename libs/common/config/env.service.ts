import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Generic environment service that provides type-safe access to environment variables.
 * This service can be used across all apps and libs to access environment configuration.
 */
@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get a string environment variable with a default value
   */
  getString(key: string, defaultValue?: string): string {
    return this.configService.get<string>(key) || defaultValue || '';
  }

  /**
   * Get a number environment variable with a default value
   */
  getNumber(key: string, defaultValue?: number): number {
    const value = this.configService.get<string>(key);
    if (value === undefined || value === null) {
      return defaultValue ?? 0;
    }
    return parseInt(value, 10);
  }

  /**
   * Get a boolean environment variable with a default value
   */
  getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.configService.get<string>(key);
    if (value === undefined || value === null) {
      return defaultValue ?? false;
    }
    return value.toLowerCase() === 'true' || value === '1';
  }

  /**
   * Check if running in development mode
   */
  isDevelopment(): boolean {
    return this.getString('APP_ENV', 'development') === 'development';
  }

  /**
   * Check if running in production mode
   */
  isProduction(): boolean {
    return this.getString('APP_ENV', 'development') === 'production';
  }

  /**
   * Check if running in test mode
   */
  isTest(): boolean {
    return this.getString('APP_ENV', 'development') === 'test';
  }

  // ==========================================
  // Auth-specific helper methods
  // ==========================================

  /**
   * Get JWT secret key
   */
  getJwtSecretKey(): string {
    return this.getString('JWT_SECRET_KEY') || this.getString('JWT_SECRET') || 'your_jwt_secret';
  }

  /**
   * Get access token expiration time
   */
  getAccessTokenLife(): string {
    return this.getString('ACCESS_TOKEN_LIFE', '5d');
  }

  /**
   * Get refresh token expiration time
   */
  getRefreshTokenLife(): string {
    return this.getString('REFRESH_TOKEN_LIFE', '30d');
  }

  /**
   * Get reset password token expiration time
   */
  getResetPasswordTokenLife(): string {
    return this.getString('RESET_PASSWORD_TOKEN_LIFE', '10m');
  }

  /**
   * Get password salt rounds
   */
  getPasswordSalt(): number {
    return this.getNumber('PASSWORD_SALT', 12);
  }

  /**
   * Get user OTP salt
   */
  getUserOtpSalt(): number {
    return this.getNumber('USER_OTP_SALT', 5);
  }

  /**
   * Get user OTP expiration time in seconds
   */
  getUserOtpExpiredTime(): number {
    return this.getNumber('USER_OTP_EXPIRED_TIME', 300);
  }

  // ==========================================
  // Database-specific helper methods
  // ==========================================

  /**
   * Get database connection URL
   */
  getDbConnectionString(): string {
    return this.getString('DB_CONNECTION_URL', 'mongodb://localhost:27017/ride_hailing');
  }

  // ==========================================
  // Application-specific helper methods
  // ==========================================

  /**
   * Get application environment
   */
  getAppEnv(): string {
    return this.getString('APP_ENV', 'development');
  }

  /**
   * Get application port
   */
  getPort(): number {
    return this.getNumber('PORT', 3000);
  }

  /**
   * Get application host
   */
  getHost(): string {
    return this.getString('HOST', '0.0.0.0');
  }
}