import dotenv from 'dotenv';
import path from 'path';
import { envSchema, type EnvConfig } from './env.validation';

function loadEnvFile(envName: string): void {
  // Load base .env file first (optional)
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });

  // Load environment specific .env file which overrides base values
  const envPath = path.resolve(__dirname, `../../env/.env.${envName}`);
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    throw new Error(
      `Error loading environment variables from ${envPath}: ${result.error.message}`,
    );
  }
}

function validateEnv(): EnvConfig {
  // Parse and validate environment variables
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables');
  }

  return result.data;
}

// Load environment-specific variables
const nodeEnv = process.env.NODE_ENV || 'development';
loadEnvFile(nodeEnv);

// Validate and export environment configuration
export const env = validateEnv();

// Export environment helper functions
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
