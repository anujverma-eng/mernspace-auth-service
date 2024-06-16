import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserService } from "../services/user.service";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/user.entity";
import { logger } from "../config/logger";
import registerValidator from "../validators/register.validator";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, logger);

router.post("/register", registerValidator, (req: Request, res: Response, next: NextFunction) => {
  void authController.register(req, res, next);
});

export default router;
