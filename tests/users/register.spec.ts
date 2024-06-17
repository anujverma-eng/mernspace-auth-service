import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { isJwt, truncateTables } from "../utils";
import { User } from "../../src/entity/user.entity";
import { ROLES } from "../../src/constants";

describe("POST /auth/register", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // Database truncate: clear all DB in Test DB
    await connection.dropDatabase();
    await connection.synchronize();
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
        password: "Password@123",
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
        password: "Password@123",
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
        password: "Password@123",
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

    it("should match the ID in DB", async () => {
      // Arrange
      const userData = {
        firstName: "Anuj",
        lastName: "verma",
        email: "anuj@anuj.com",
        password: "Password@123",
      };
      // Act
      const resp = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(resp.body).toHaveProperty("id");
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect((resp.body as Record<string, string>).id).toBe(users[0].id);
    });

    it("should have the role customer only", async () => {
      // Arrange
      const userData = {
        firstName: "Anuj",
        lastName: "verma",
        email: "anuj@anuj.com",
        password: "Password@123",
      };
      // Act
      await request(app).post("/auth/register").send(userData);
      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty("role");
      expect(users[0].role).toBe(ROLES.CUSTOMER);
    });

    it("should hash the password", async () => {
      // Arrange
      const userData = {
        firstName: "Anuj",
        lastName: "verma",
        email: "anuj@anuj.com",
        password: "Password@123",
      };
      // Act
      await request(app).post("/auth/register").send(userData);
      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
    });

    it("should return status code of 400, as duplicate user found", async () => {
      // Arrange
      const userData = {
        firstName: "Anuj",
        lastName: "verma",
        email: "anuj@anuj.com",
        password: "Password@123",
      };
      // Act
      const userRepository = connection.getRepository(User);

      await userRepository.save({ ...userData, role: ROLES.CUSTOMER });

      const response = await request(app).post("/auth/register").send(userData);

      const users = await userRepository.find();

      expect(response.status).toBe(400);
      expect(users).toHaveLength(1);
    });

    it("should return accessToken and RefreshToken in cookie", async () => {
      // Arrange
      const userData = {
        firstName: "Anuj",
        lastName: "verma",
        email: "anuj@anuj.com",
        password: "Password@123",
      };
      // Act

      const response = await request(app).post("/auth/register").send(userData);

      interface IHeaders {
        ["set-cookie"]: string[];
      }
      const cookies = (response.headers as unknown as IHeaders)["set-cookie"] || [];

      let accessToken = null,
        refreshToken = null;

      cookies.forEach(cookie => {
        if (cookie.startsWith("accessToken=")) {
          accessToken = cookie.split(";")[0].split("=")[1];
        }
        if (cookie.startsWith("refreshToken=")) {
          refreshToken = cookie.split(";")[0].split("=")[1];
        }
      });

      //Assert

      expect(accessToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();

      expect(isJwt(accessToken)).toBeTruthy();
      expect(isJwt(refreshToken)).toBeTruthy();
    });
  });
  describe("some fields missing", () => {
    it("should return status code of 400, Email should not be empty", async () => {
      // Arrange
      const userData = {
        firstName: "Anuj",
        lastName: "verma",
        email: "",
        password: "Password@123",
      };
      // Act
      const userRepository = connection.getRepository(User);

      const response = await request(app).post("/auth/register").send(userData);
      const users = await userRepository.find();
      expect(response.status).toBe(400);
      expect(users).toHaveLength(0);
      expect((response.body as Record<string, string>).errors.length).toBeGreaterThanOrEqual(1);
    });
    it("should return status code of 400, as correct Email required", async () => {
      // Arrange
      const userData = {
        firstName: "Anuj",
        lastName: "verma",
        email: "wrongEmail",
        password: "password",
      };
      // Act
      const userRepository = connection.getRepository(User);
      const response = await request(app).post("/auth/register").send(userData);
      const users = await userRepository.find();
      //Assert
      expect(response.status).toBe(400);
      expect(users).toHaveLength(0);
      expect((response.body as Record<string, string>).errors.length).toBeGreaterThanOrEqual(1);
    });

    it("should return status code of 400, as First Name required", async () => {
      // Arrange
      const userData = {
        firstName: "",
        lastName: "verma",
        email: "wrongEmail@gmail.com",
        password: "Password@123",
      };
      // Act
      const userRepository = connection.getRepository(User);
      const response = await request(app).post("/auth/register").send(userData);
      const users = await userRepository.find();
      //Assert

      expect(response.status).toBe(400);
      expect(users).toHaveLength(0);
      expect((response.body as Record<string, string>).errors.length).toBeGreaterThanOrEqual(1);
    });

    it("should return status code of 400, as Last Name required", async () => {
      // Arrange
      const userData = {
        firstName: "Anuj Verma",
        lastName: "",
        email: "wrongEmail@gmail.com",
        password: "password",
      };
      // Act
      const userRepository = connection.getRepository(User);
      const response = await request(app).post("/auth/register").send(userData);
      const users = await userRepository.find();
      //Assert
      expect(response.status).toBe(400);
      expect(users).toHaveLength(0);
      expect((response.body as Record<string, string>).errors.length).toBeGreaterThanOrEqual(1);
    });

    it("should return status code of 400, as Password required", async () => {
      // Arrange
      const userData = {
        firstName: "Anuj",
        lastName: "Verma",
        email: "wrongEmail@gmail.com",
        password: "",
      };
      // Act
      const userRepository = connection.getRepository(User);
      const response = await request(app).post("/auth/register").send(userData);
      const users = await userRepository.find();
      //Assert
      expect(response.status).toBe(400);
      expect(users).toHaveLength(0);
      expect((response.body as Record<string, string>).errors.length).toBeGreaterThanOrEqual(1);
    });
  });
});
