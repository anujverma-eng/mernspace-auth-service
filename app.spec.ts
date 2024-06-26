import request from "supertest";
import { calculateDiscount } from "./src/utils";
import app from "./src/app";

describe.skip("Discounts", () => {
  it("should calculate the correct discount", () => {
    const result = calculateDiscount(100, 10);
    expect(result).toBe(10);
  });

  it("should say Hi to me", async () => {
    const response = await request(app).get("/").send();
    expect(response.statusCode).toBe(200);
  });
});
