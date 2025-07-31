/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Supabase Configuration
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  
  // Application Configuration
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENV: 'development' | 'production' | 'staging';
  
  // Feature Flags
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_DEBUG_MODE: string;
  
  // API Configuration
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_MAX_FILE_SIZE: string;
  
  // Payment Gateway
  readonly VITE_STRIPE_PUBLIC_KEY?: string;
  
  // Email Service
  readonly VITE_EMAIL_SERVICE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
