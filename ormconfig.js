const { DataSource } = require("typeorm");

// Environment variables with defaults
const config = {
  type: process.env.DB_TYPE || "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "nestJs",
  synchronize: false, // Always false for production
  logging: false,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/db/migrations/*.js"],
  migrationsRun: false,
  migrationsTableName: "typeorm_migrations",
};

const AppDataSource = new DataSource(config);

module.exports = { AppDataSource };
