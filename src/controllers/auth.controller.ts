import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import { UserService } from "../services/user.service";
import { RegisterUserRequest } from "../types";

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
      const data = await this.userService.create({ firstName, lastName, email, password });
      this.logger.info("User has been Registered", { id: data.id });
      res.status(201).json(data);
    } catch (error) {
      next(error);
      return;
    }
  }
}
