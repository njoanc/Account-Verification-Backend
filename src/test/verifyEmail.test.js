import request from "supertest";
import app from "../index";
import mongoose from "mongoose";
import User from "../models/user";
import Token from "../models/token";
import connectDB from "../config/db";
import winston from "winston";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [new winston.transports.Console()],
});

describe("Email verification", () => {
  jest.setTimeout(5000);
  let user;
  let token;
  let db;

  //   beforeAll(async () => {
  //     db = await connectDB();
  //     logger.info("MongoDB connected successfully");
  //   });

  //   afterAll(async () => {
  //     await mongoose.disconnect();
  //   });

  //   beforeEach(async () => {
  //     // Create a new user and token for each test
  //     user = new User({
  //       name: "John Kabera",
  //       email: "johndoe@gmail.com.com",
  //       password: "password123",
  //       isEmailVerified: false,
  //     });
  //     await user.save();

  //     token = new Token({
  //       userId: user._id,
  //       token: "test-token",
  //     });
  //     await token.save();
  //   });

  //   afterEach(async () => {
  //     // Remove the user and token after each test
  //     await User.deleteMany();
  //     await Token.deleteMany();
  //   });

  it("should verify email when given a valid user ID and token", async () => {
    // Send a request to the verifyEmail endpoint with the user ID and token
    const response = await request(app)
      .get(
        "/users/verify/645188bef874d1ac5ed2f8c6/925d730c6c81c86ba3c1e44c5486cad6aa548c5c5aea4a3e384cefcf86f1d859"
      )
      .send();

    // Expect the response status to be 200
    expect(response.status).toBe(200);

    // Expect the user's isEmailVerified field to be true
    const updatedUser = await User.findOne({ _id: "645188bef874d1ac5ed2f8c6" });
    expect(updatedUser.isEmailVerified).toBe(true);

    // Expect the token to be deleted from the database
    const deletedToken = await Token.findOne({ _id: token._id });
    expect(deletedToken).toBe(null);

    // Expect the response body to contain a success message
    expect(response.text).toContain("Email verified successfully");
  });

  it("should return an error message when given an invalid user ID or token", async () => {
    // Send a request to the verifyEmail endpoint with an invalid user ID and token
    const response = await request(app)
      .get(`/users/verify/invalid-id/invalid-token`)
      .send();

    // Expect the response status to be 400
    expect(response.status).toBe(400);

    // Expect the user's isEmailVerified field to be false
    const updatedUser = await User.findOne({ _id: "644d1b01312efbdbd70dff9c" });
    expect(updatedUser.isEmailVerified).toBe(false);

    // Expect the token to still exist in the database
    const existingToken = await Token.findOne({
      _id: "644e17156abe67e3714a1c91",
    });
    expect(existingToken).not.toBe(null);

    // Expect the response body to contain an error message
    expect(response.text).toContain("Invalid link");
  });
});
