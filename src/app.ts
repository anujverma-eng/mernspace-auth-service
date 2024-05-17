import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hi I am working !!!");
});

export default app;
