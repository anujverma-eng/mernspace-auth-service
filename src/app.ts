import "reflect-metadata";
import express from "express";
import errorMiddleWare from "./errors/errorMiddleware";
import authRouter from "./routes/auth.route";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hi I am working !!!");
});

app.use("/auth", authRouter);

//Global Error Handler Middleware
app.use(errorMiddleWare);

export default app;
