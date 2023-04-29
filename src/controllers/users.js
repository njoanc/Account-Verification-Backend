import bcrypt from "bcrypt";
import httpStatus from "http-status";
import User from "../models/user";

// Create User
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  // Check if username is already taken
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already taken" });
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  // Return success message
  res.status(201).json({ data: newUser, message: "User created successfully" });
};

export default { createUser };
