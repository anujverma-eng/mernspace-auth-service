import express from "express";
import createHttpError from "http-errors";
import errorMiddleWare from "./errors/errorMiddleware";

const app = express();

app.get("/", (req, res) => {
  const err = createHttpError(400, "Oh! Man Bad Request!!");
  throw err;
  res.send("Hi I am working !!!");
});

//Global Error Handler Middleware
app.use(errorMiddleWare);

export default app;
