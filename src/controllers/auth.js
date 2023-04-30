import jwt from "jsonwebtoken";
import User from "../models/user";

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Verify password
  const passwordMatch = await user.verifyPassword(password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (user.isEmailVerified === false) {
    return res.status(401).json({ message: "Verify your email" });
  }

  // Generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

  // Return token and user information
  return res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
    },
  });
};

export default { login };
