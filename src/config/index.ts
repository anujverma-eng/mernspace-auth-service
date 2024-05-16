import { config } from "dotenv";

config();

const { PORT = "4000" } = process.env;

export const Config = {
  PORT,
};
