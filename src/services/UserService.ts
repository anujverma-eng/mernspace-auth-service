import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { ROLES } from "../constants";

export class UserService {
  constructor(private userRepository: Repository<User>) {}
  async create({ firstName, lastName, email, password }: UserData) {
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
        role: ROLES.CUSTOMER,
      });
    } catch (error) {
      const err = createHttpError(500, "Failed to store user data in database, UserService");
      throw err;
    }
  }
}
