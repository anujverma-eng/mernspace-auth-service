import { Config } from "./config";
import app from "./app";

const startServer = () => {
  const PORT = Config.PORT;

  try {
    app.listen(PORT, () => {
      console.log(`server is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
