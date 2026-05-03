export interface AuthConfig {
  /**
   * The role of the user (e.g., 'user', 'driver', 'admin')
   */
  role: string;

  /**
   * The loginAs value for this auth context
   */
  loginAs: string;

  /**
   * Whether to include userDetails in the response
   */
  includeUserDetails?: boolean;

  /**
   * Whether device registration is required
   */
  requireDevice?: boolean;

  /**
   * Custom validation rules for this auth context
   */
  customValidation?: Record<string, unknown>;
}

export interface AuthModuleOptions {
  /**
   * Configuration for the auth module
   */
  config: AuthConfig;
}