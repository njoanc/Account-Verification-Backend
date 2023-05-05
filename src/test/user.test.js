import mongoose from "mongoose";
import supertest from "supertest";
import app from "../index";
const api = supertest(app);

import User from "../models/user";

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
};

beforeEach(async () => {
  await User.deleteOne({});
  let userObject = new User(user);
  await userObject.save();
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe(" POST User signup", () => {
  it("should create a new user", async () => {
    const newUser = {
      name: "John Muvara",
      email: "njoanc@gmail.com",
      password: "password@123",
      gender: "MALE",
      age: 30,
      dateOfBirth: "1991-01-01",
      maritalStatus: "SINGLE",
      nationality: "RWANDAN",
    };
    const res = await api.post("/users/signup").send(newUser).expect(201);
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

afterAll(async () => {
  await mongoose.connection.close();
});

//   it.each([
//     [
//       "Jane Kazuba",
//       "johndoe@gmail.com",
//       "password456",
//       "FEMALE",
//       25,
//       "1996-01-01",
//       "MARRIED",
//       "KENYA",
//       "Email already taken",
//     ],
//     [
//       "Bob Smith",
//       "bobsmith@gmail.com",
//       "password789",
//       "MALE",
//       40,
//       "1981-01-01",
//       "DIVORCED",
//       "KENYA",
//       "An error occurred",
//     ],
//   ])(
//     "should return an error if any required field is missing",
//     async (
//       name,
//       email,
//       password,
//       gender,
//       age,
//       dateOfBirth,
//       maritalStatus,
//       nationality,
//       expected
//     ) => {
//       const res = await request(app)
//         .post("/users/signup")
//         .send({
//           name,
//           email,
//           password,
//           gender,
//           age,
//           dateOfBirth,
//           maritalStatus,
//           nationality,
//         })
//         .expect(400);

//       expect(res.text).toBe(expected);
//     }
//   );
// });
