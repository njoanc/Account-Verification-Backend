import request from "supertest";
import app from "../index";
import mongoose from "mongoose";
import connectDB from "../config/db";

describe("User signup", () => {
  beforeAll((done) => {
    connectDB()
      .then(() => {
        console.log("MongoDB connected successfully");
        done();
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        done();
      });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new user with valid input", async () => {
    const res = await request(app).post("/api/users/signup").send({
      name: "Jehanne Kazuba",
      email: "jeanned@gmail.com",
      password: "Password123",
    });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("name", "Jehanne Kazuba");
    expect(res.body).toHaveProperty("email", "jeanned@gmail.com");
  });

  it("should return an error with invalid credentials", async () => {
    const res = await request(app).post("/api/users/signup").send({
      name: "Jehanne Kazuba",
      email: "jeanne@gmail.com",
      password: "password", // invalid password
    });
    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual("Invalid user input");
  });
});
