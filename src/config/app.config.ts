import * as dotenv from "dotenv";

dotenv.config({
  path: process.cwd() + "/.env",
});

export const APP_CONFIGS = {
  DB: {
    TYPE: process.env["DB_TYPE"] || "mysql",
    DB_HOST: process.env["DB_HOST"] || "localhost",
    DB_PORT: parseInt(process.env["DB_PORT"]) || 3306,
    DB_USER: process.env["DB_USER"] || "mysql",
    DB_PASSWORD: process.env["DB_PASSWORD"] || "mysql",
    DB_NAME: process.env["DB_NAME"] || "auth_starter_db",
    SYNCHRONIZE: process.env["DB_SYNCHRONIZE"] === "true",
  },
  JWT: {
    SECRET: process.env["JWT_SECRET"] || "your-secret-key",
    TOKEN_EXPIRY: process.env["JWT_TOKEN_EXPIRY"] || "1h",
    REFRESH_SECRET:
      process.env["JWT_REFRESH_SECRET"] || "your-refresh-secret-key",
    REFRESH_EXPIRY: process.env["JWT_REFRESH_EXPIRY"] || "7d",
  },
  RATE_LIMIT: {
    TTL: process.env["RATE_LIMIT_TTL"] || 60,
    LIMIT: process.env["RATE_LIMIT_LIMIT"] || 100,
  },
  ENV: process.env["NODE_ENV"] || "development",
  PORT: parseInt(process.env["PORT"]) || 3000,
};
