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
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  CLOUDINARY_UPLOAD_FOLDER?: string;
  PASSWORD_RESET_MAIL_MODE?: string;
  GMAIL_FROM_EMAIL?: string;
  GMAIL_CLIENT_ID?: string;
  GMAIL_CLIENT_SECRET?: string;
  GMAIL_REFRESH_TOKEN?: string;
  TIMELY_API_KEY?: string;
  TIMELY_BASE_URL?: string;
  TIMELY_MODEL?: string;
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
    CLOUDINARY_CLOUD_NAME:
      typeof config.CLOUDINARY_CLOUD_NAME === 'string' &&
      config.CLOUDINARY_CLOUD_NAME.length > 0
        ? config.CLOUDINARY_CLOUD_NAME
        : undefined,
    CLOUDINARY_API_KEY:
      typeof config.CLOUDINARY_API_KEY === 'string' &&
      config.CLOUDINARY_API_KEY.length > 0
        ? config.CLOUDINARY_API_KEY
        : undefined,
    CLOUDINARY_API_SECRET:
      typeof config.CLOUDINARY_API_SECRET === 'string' &&
      config.CLOUDINARY_API_SECRET.length > 0
        ? config.CLOUDINARY_API_SECRET
        : undefined,
    CLOUDINARY_UPLOAD_FOLDER:
      typeof config.CLOUDINARY_UPLOAD_FOLDER === 'string' &&
      config.CLOUDINARY_UPLOAD_FOLDER.length > 0
        ? config.CLOUDINARY_UPLOAD_FOLDER
        : undefined,
    PASSWORD_RESET_MAIL_MODE:
      typeof config.PASSWORD_RESET_MAIL_MODE === 'string' &&
      config.PASSWORD_RESET_MAIL_MODE.length > 0
        ? config.PASSWORD_RESET_MAIL_MODE
        : undefined,
    GMAIL_FROM_EMAIL:
      typeof config.GMAIL_FROM_EMAIL === 'string' &&
      config.GMAIL_FROM_EMAIL.length > 0
        ? config.GMAIL_FROM_EMAIL
        : undefined,
    GMAIL_CLIENT_ID:
      typeof config.GMAIL_CLIENT_ID === 'string' &&
      config.GMAIL_CLIENT_ID.length > 0
        ? config.GMAIL_CLIENT_ID
        : undefined,
    GMAIL_CLIENT_SECRET:
      typeof config.GMAIL_CLIENT_SECRET === 'string' &&
      config.GMAIL_CLIENT_SECRET.length > 0
        ? config.GMAIL_CLIENT_SECRET
        : undefined,
    GMAIL_REFRESH_TOKEN:
      typeof config.GMAIL_REFRESH_TOKEN === 'string' &&
      config.GMAIL_REFRESH_TOKEN.length > 0
        ? config.GMAIL_REFRESH_TOKEN
        : undefined,
    TIMELY_API_KEY:
      typeof config.TIMELY_API_KEY === 'string' &&
      config.TIMELY_API_KEY.length > 0
        ? config.TIMELY_API_KEY
        : undefined,
    TIMELY_BASE_URL:
      typeof config.TIMELY_BASE_URL === 'string' &&
      config.TIMELY_BASE_URL.length > 0
        ? config.TIMELY_BASE_URL
        : undefined,
    TIMELY_MODEL:
      typeof config.TIMELY_MODEL === 'string' && config.TIMELY_MODEL.length > 0
        ? config.TIMELY_MODEL
        : undefined,
  };
}
