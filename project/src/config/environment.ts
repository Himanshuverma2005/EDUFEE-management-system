// Environment configuration with validation
interface EnvironmentConfig {
  // Supabase Configuration
  supabase: {
    url: string;
    anonKey: string;
  };
  
  // Application Configuration
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'staging';
  };
  
  // Feature Flags
  features: {
    analytics: boolean;
    debugMode: boolean;
  };
  
  // API Configuration
  api: {
    timeout: number;
    maxFileSize: number;
  };
  
  // Payment Gateway
  payment: {
    stripePublicKey?: string;
  };
  
  // Email Service
  email: {
    serviceUrl?: string;
  };
}

// Environment variable validation
const validateEnvironment = (): EnvironmentConfig => {
  const requiredVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  return {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL!,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
    },
    app: {
      name: import.meta.env.VITE_APP_NAME || 'EduFees Management System',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: (import.meta.env.VITE_APP_ENV as EnvironmentConfig['app']['environment']) || 'development',
    },
    features: {
      analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
    },
    api: {
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
      maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880', 10),
    },
    payment: {
      stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    },
    email: {
      serviceUrl: import.meta.env.VITE_EMAIL_SERVICE_URL,
    },
  };
};

// Export validated environment configuration
export const env = validateEnvironment();

// Helper functions for environment checks
export const isDevelopment = () => env.app.environment === 'development';
export const isProduction = () => env.app.environment === 'production';
export const isStaging = () => env.app.environment === 'staging';

// Debug logging in development
if (isDevelopment() && env.features.debugMode) {
  console.log('Environment Configuration:', {
    app: env.app,
    features: env.features,
    api: env.api,
  });
} 