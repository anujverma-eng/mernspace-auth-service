import fs from "fs";
import path from "path";
import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import { UserService } from "../services/user.service";
import { RegisterUserRequest } from "../types";
import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { Config } from "../config";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { firstName, lastName, email, password } = req.body;
    this.logger.debug("user register request", {
      firstName,
      lastName,
      email,
      password: "********",
    });
    try {
      const user = await this.userService.create({ firstName, lastName, email, password });
      this.logger.info("User has been Registered", { id: user.id });

      let privateKey: Buffer;
      try {
        privateKey = fs.readFileSync(path.join(__dirname, "../../certs/private.pem"));
      } catch (error) {
        const err = createHttpError(500, "Error while reading private key");
        next(err);
        return;
      }

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };
      const accessToken = sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "auth-service",
      });
      const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
        algorithm: "HS256",
        expiresIn: "1Y",
        issuer: "auth-service",
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        httpOnly: true,
        sameSite: true,
        maxAge: 1000 * 60 * 60, // 1h
      });
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        httpOnly: true,
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1Y
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
      return;
    }
  }
}
