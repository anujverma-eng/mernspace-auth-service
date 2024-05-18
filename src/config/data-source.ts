import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Config } from ".";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.DB_HOST,
  port: Number(Config.PORT),
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,

  // Don't use [synchronize] this in Production
  synchronize: Config.NODE_ENV !== "production",
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
