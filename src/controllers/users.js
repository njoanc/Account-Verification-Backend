import bcrypt from "bcrypt";
import httpStatus from "http-status";
import User from "../models/user";
import Token from "../models/token";
import sendMail from "../utils/sendMail";
import crypto from "crypto";

// Create User
const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      age,
      dateOfBirth,
      maritalStatus,
      nationality,
    } = req.body;

    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already taken" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Use the correct field name
      gender,
      age,
      dateOfBirth,
      maritalStatus,
      nationality,
    });
    await newUser.save();

    let newToken = await new Token({
      // Use the correct variable name
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const message = `${process.env.BASE_URL}/users/verify/${newUser.id}/${newToken.token}`;
    await sendMail(newUser.email, "Verify Email", message);

    res.send(
      "An email has been sent to your account, please verify your email"
    );
  } catch (error) {
    console.log(error); // Log the error for debugging
    res.status(400).send("An error occurred");
  }
};

const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id }, { isEmailVerified: true }); // Use the correct update syntax
    await Token.findByIdAndRemove(token._id);

    res.send("Email verified successfully");
  } catch (error) {
    console.log(error); // Log the error for debugging
    res.status(400).send("An error occurred");
  }
};

export default { createUser, verifyEmail };
