import request from "supertest";
import app from "../index";
import mongoose from "mongoose";
import User from "../models/user";

import connectDB from "../config/db";
import winston from "winston";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [new winston.transports.Console()],
});

describe("POST /users/:userId/verification", () => {
  //   let db;

  //   beforeAll(async () => {
  //     db = await connectDB();
  //     logger.info("MongoDB connected successfully");
  //   });

  //   afterAll(async () => {
  //     await mongoose.connection.close();
  //   });

  //   beforeEach(async () => {
  //     await User.deleteMany();
  //   });

  it("should verify user account with national ID", async () => {
    const userId = "user123";
    const nationalId = "1193770071292032";
    const nationalIdPic = "http://example.com/national_id.jpg";

    const res = await request(app)
      .post(`/users/644d1b01312efbdbd70dff9c/verification`)
      .field("nationalId", nationalId)
      .attach("nationalIdPic", nationalIdPic);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Your account has been verified");
  });

  it("should verify user account with passport", async () => {
    const userId = "user123";
    const passportNumber = "AB123456";
    const passportPic = "http://example.com/passport.jpg";

    const res = await request(app)
      .post(`/users/644d1b01312efbdbd70dff9c/verification`)
      .field("passportNumber", passportNumber)
      .attach("passportPic", passportPic);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Your account has been verified");
  });

  it("should return 500 error on server error", async () => {
    const userId = "user123";
    const nationalId = "12345678";
    const nationalIdPic = "http://example.com/national_id.jpg";

    jest
      .spyOn(User, "findByIdAndUpdate")
      .mockRejectedValueOnce(new Error("Database error"));

    const res = await request(app)
      .post(`/users/644d1b01312efbdbd70dff9c/verification`)
      .field("nationalId", nationalId)
      .attach("nationalIdPic", nationalIdPic);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Server error");
  });
});
