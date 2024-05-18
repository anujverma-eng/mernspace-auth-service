import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
  describe("Given all fields", () => {
    it("should return status code: 201", async () => {
      // Arrange
      const userData = {
        name: "anuj",
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
        name: "anuj",
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
  });
  describe("some fields missing", () => {});
});
