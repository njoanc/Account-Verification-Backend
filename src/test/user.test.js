import request from "supertest";
import app from "../index";
import mongoose from "mongoose";
import connectDB from "../config/db";
import winston from "winston";

import User from "../models/user";
import Token from "../models/token";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [new winston.transports.Console()],
});

describe("User signup", () => {
  // let db;

  // beforeAll(async () => {
  //   db = await connectDB();
  //   logger.info("MongoDB connected successfully");
  // });

  // afterAll(async () => {
  //   await mongoose.connection.close();
  // });

  // beforeEach(async () => {
  //   await User.deleteMany({});
  // });

  it("should create a new user", async () => {
    const res = await request(app)
      .post("/users/signup")
      .send({
        name: "John Muvara",
        email: "johndoe@gmail.com",
        password: "password123",
        gender: "MALE",
        age: 30,
        dateOfBirth: "1991-01-01",
        maritalStatus: "SINGLE",
        nationality: "RWANDAN",
      })
      .expect(200);

    expect(res.text).toBe(
      "An email has been sent to your account, please verify your email"
    );
  });

  it.each([
    [
      "Jane Kazuba",
      "johndoe@gmail.com",
      "password456",
      "FEMALE",
      25,
      "1996-01-01",
      "MARRIED",
      "KENYA",
      "Email already taken",
    ],
    [
      "Bob Smith",
      "bobsmith@gmail.com",
      "password789",
      "MALE",
      40,
      "1981-01-01",
      "DIVORCED",
      "KENYA",
      "An error occurred",
    ],
  ])(
    "should return an error if any required field is missing",
    async (
      name,
      email,
      password,
      gender,
      age,
      dateOfBirth,
      maritalStatus,
      nationality,
      expected
    ) => {
      const res = await request(app)
        .post("/users/signup")
        .send({
          name,
          email,
          password,
          gender,
          age,
          dateOfBirth,
          maritalStatus,
          nationality,
        })
        .expect(400);

      expect(res.text).toBe(expected);
    }
  );
});
