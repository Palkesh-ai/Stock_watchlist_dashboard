import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  finnhub: {
    apiKey: process.env.FINNHUB_API_KEY as string,
    baseUrl: process.env.FINNHUB_BASE_URL || 'https://finnhub.io/api/v1',
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
} as const;

// Validate critical env vars at startup
const required: (keyof typeof env)[] = ['mongoUri', 'jwtSecret'];
for (const key of required) {
  if (!env[key]) {
    console.error(`FATAL: Missing required environment variable mapped to env.${key}`);
    process.exit(1);
  }
}

export default env;
