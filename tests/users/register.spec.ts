import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { truncateTables } from "../utils";
import { User } from "../../src/entity/User";

describe("POST /auth/register", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // Database truncate: clear all DB in Test DB
    await truncateTables(connection);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("Given all fields", () => {
    it("should return status code: 201", async () => {
      // Arrange
      const userData = {
        firstName: "anuj verma",
        lastName: "anuj",
        email: "anuj@anuj.com",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(response.statusCode).toBe(201);
    });

    it("should return valid json response", async () => {
      // Arrange
      const userData = {
        firstName: "anuj verma",
        lastName: "anuj",
        email: "anuj@anuj.com",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect((response.headers as Record<string, string>)["content-type"]).toEqual(
        expect.stringContaining("json"),
      );
    });

    it("should persist the user in the database", async () => {
      // Arrange
      const userData = {
        firstName: "first",
        lastName: "verma",
        email: "anuj@anuj.com",
        password: "password",
      };
      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });
  });
  describe("some fields missing", () => {});
});
