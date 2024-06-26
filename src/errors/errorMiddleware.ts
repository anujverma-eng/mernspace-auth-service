import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { logger } from "../config/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleWare = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        message: err.message,
        statusCode: err.statusCode,
        status: err.status,
        path: "",
        location: "",
      },
    ],
  });
};

export default errorMiddleWare;
