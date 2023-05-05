import mongoose from "mongoose";
import supertest from "supertest";
import app from "../index";
import User from "../models/user";
import Token from "../models/token";

const api = supertest(app);

jest.setTimeout(30000); // set timeout to 30 seconds

const user = {
  name: "John Muvara",
  email: "johndoe@gmail.com",
  password: "password123",
  gender: "MALE",
  age: 30,
  dateOfBirth: "1991-01-01",
  maritalStatus: "SINGLE",
  nationality: "RWANDAN",
  isEmailVerified: false,
};

beforeEach(async () => {
  await User.deleteMany({});
  const userObject = new User(user);
  await userObject.save();

  await Token.deleteMany({});
  const newToken = new Token({
    userId: userObject._id,
    token: "test-@fgjkhler4832otoken",
  });
  await newToken.save();
});

afterEach(async () => {
  await User.deleteMany({});
  await Token.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST User signup", () => {
  it("should create a new user", async () => {
    const res = await api
      .post("/users/signup")
      .send({
        name: "John Muvara",
        email: "njoanc@gmail.com",
        password: "password@123",
        gender: "MALE",
        age: 30,
        dateOfBirth: "1991-01-01",
        maritalStatus: "SINGLE",
        nationality: "RWANDAN",
        isEmailVerified: false,
      })
      .expect(201);
    expect(res.body).toEqual({
      message:
        "An email has been sent to your account, please verify your email",
    });
  });

  it("should return an error if email is already taken", async () => {
    const res = await api.post("/users/signup").send(user).expect(400);
    expect(res.body).toEqual({ error: "Email already taken" });
  }, 10000);
});
