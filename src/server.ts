import app from "./app";
import { Config } from "./config";
import { logger } from "./config/logger";

const startServer = () => {
  const PORT = Config.PORT;

  try {
    app.listen(PORT, () => {
      logger.info(`server is listening on http://localhost:${PORT}`, { Config });
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error.message);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};

startServer();
