type EnvironmentVariables = {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  MONGODB_DB_NAME?: string;
  CORS_ORIGIN: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  EXPIRY_NOTIFICATION_CRON: string;
};

const allowedNodeEnvs = ['development', 'test', 'production'];

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const nodeEnv =
    typeof config.NODE_ENV === 'string' && config.NODE_ENV.length > 0
      ? config.NODE_ENV
      : 'development';

  if (!allowedNodeEnvs.includes(nodeEnv)) {
    throw new Error(
      `NODE_ENV must be one of: ${allowedNodeEnvs.join(', ')}`,
    );
  }

  const rawPort = config.PORT ?? 3000;
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT must be a valid TCP port number');
  }

  const mongodbUri =
    typeof config.MONGODB_URI === 'string' && config.MONGODB_URI.length > 0
      ? config.MONGODB_URI
      : 'mongodb://localhost:27017/navimart';

  return {
    NODE_ENV: nodeEnv,
    PORT: port,
    MONGODB_URI: mongodbUri,
    MONGODB_DB_NAME:
      typeof config.MONGODB_DB_NAME === 'string' &&
      config.MONGODB_DB_NAME.length > 0
        ? config.MONGODB_DB_NAME
        : undefined,
    CORS_ORIGIN:
      typeof config.CORS_ORIGIN === 'string' && config.CORS_ORIGIN.length > 0
        ? config.CORS_ORIGIN
        : 'http://localhost:5173',
    JWT_ACCESS_SECRET:
      typeof config.JWT_ACCESS_SECRET === 'string' &&
      config.JWT_ACCESS_SECRET.length > 0
        ? config.JWT_ACCESS_SECRET
        : 'dev-access-secret-change-me',
    JWT_ACCESS_EXPIRES_IN:
      typeof config.JWT_ACCESS_EXPIRES_IN === 'string' &&
      config.JWT_ACCESS_EXPIRES_IN.length > 0
        ? config.JWT_ACCESS_EXPIRES_IN
        : '15m',
    JWT_REFRESH_SECRET:
      typeof config.JWT_REFRESH_SECRET === 'string' &&
      config.JWT_REFRESH_SECRET.length > 0
        ? config.JWT_REFRESH_SECRET
        : 'dev-refresh-secret-change-me',
    JWT_REFRESH_EXPIRES_IN:
      typeof config.JWT_REFRESH_EXPIRES_IN === 'string' &&
      config.JWT_REFRESH_EXPIRES_IN.length > 0
        ? config.JWT_REFRESH_EXPIRES_IN
        : '7d',
    EXPIRY_NOTIFICATION_CRON:
      typeof config.EXPIRY_NOTIFICATION_CRON === 'string' &&
      config.EXPIRY_NOTIFICATION_CRON.length > 0
        ? config.EXPIRY_NOTIFICATION_CRON
        : '0 8 * * *',
  };
}
