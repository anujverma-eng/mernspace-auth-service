import { NextFunction, Response } from "express";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";
import { Logger } from "winston";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
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
