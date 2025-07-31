import { env } from '../config/environment';

/**
 * Utility functions for environment variable management
 */

/**
 * Get a required environment variable
 * @param key - The environment variable key
 * @param defaultValue - Optional default value
 * @returns The environment variable value
 * @throws Error if the variable is required but not set
 */
export const getRequiredEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value || defaultValue!;
};

/**
 * Get an optional environment variable
 * @param key - The environment variable key
 * @param defaultValue - Default value if not set
 * @returns The environment variable value or default
 */
export const getOptionalEnvVar = (key: string, defaultValue: string = ''): string => {
  return import.meta.env[key] || defaultValue;
};

/**
 * Get a boolean environment variable
 * @param key - The environment variable key
 * @param defaultValue - Default value if not set
 * @returns Boolean value
 */
export const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

/**
 * Get a number environment variable
 * @param key - The environment variable key
 * @param defaultValue - Default value if not set
 * @returns Number value
 */
export const getNumberEnvVar = (key: string, defaultValue: number = 0): number => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Validate that all required environment variables are set
 * @param requiredVars - Array of required environment variable keys
 * @throws Error if any required variables are missing
 */
export const validateRequiredEnvVars = (requiredVars: string[]): void => {
  const missingVars = requiredVars.filter(key => !import.meta.env[key]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.\n' +
      'You can copy env.example to .env and fill in the required values.'
    );
  }
};

/**
 * Get environment-specific configuration
 */
export const getEnvironmentConfig = () => {
  return {
    isDevelopment: env.app.environment === 'development',
    isProduction: env.app.environment === 'production',
    isStaging: env.app.environment === 'staging',
    appName: env.app.name,
    appVersion: env.app.version,
    debugMode: env.features.debugMode,
  };
};

/**
 * Log environment information (only in development)
 */
export const logEnvironmentInfo = (): void => {
  if (env.app.environment === 'development' && env.features.debugMode) {
    console.group('🌍 Environment Information');
    console.log('App Name:', env.app.name);
    console.log('Version:', env.app.version);
    console.log('Environment:', env.app.environment);
    console.log('Debug Mode:', env.features.debugMode);
    console.log('Analytics Enabled:', env.features.analytics);
    console.groupEnd();
  }
}; 