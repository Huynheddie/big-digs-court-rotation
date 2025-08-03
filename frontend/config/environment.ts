// Environment configuration for the volleyball court system
interface EnvironmentConfig {
  apiBaseUrl: string;
  wsUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

// Development configuration
const developmentConfig: EnvironmentConfig = {
  apiBaseUrl: 'http://localhost:3001',
  wsUrl: 'http://localhost:3001',
  isDevelopment: true,
  isProduction: false,
};

// Production configuration
const productionConfig: EnvironmentConfig = {
  apiBaseUrl: 'https://your-backend-domain.com', // Update this with your actual backend URL
  wsUrl: 'https://your-backend-domain.com', // Update this with your actual backend URL
  isDevelopment: false,
  isProduction: true,
};

// Get the current environment configuration
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? developmentConfig : productionConfig;
};

// Export the current configuration
export const config = getEnvironmentConfig();

// Export individual values for convenience
export const { apiBaseUrl, wsUrl, isDevelopment, isProduction } = config; 