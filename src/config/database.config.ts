import { DataSource } from "typeorm";
import { APP_CONFIGS } from "./app.config";

export const AppDataSource = new DataSource({
  type: APP_CONFIGS.DB.TYPE as "postgres",
  host: APP_CONFIGS.DB.DB_HOST,
  port: APP_CONFIGS.DB.DB_PORT,
  username: APP_CONFIGS.DB.DB_USER,
  password: APP_CONFIGS.DB.DB_PASSWORD,
  database: APP_CONFIGS.DB.DB_NAME,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../db/migrations/*{.ts,.js}"],
  synchronize: APP_CONFIGS.DB.SYNCHRONIZE,
  logging: APP_CONFIGS.ENV === "development",
  logger: "advanced-console",
});

export default AppDataSource;
