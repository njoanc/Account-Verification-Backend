import jwt from "jsonwebtoken";
import User from "../models/user";
import crypto from "crypto";
import Token from "../models/token";
import moment from "moment";
import sendMail from "../utils/sendMail";
import bcrypt from "bcrypt";

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

const resetPassword = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(400).json({ error: "Email does not exist" });
  }

  const newToken = crypto.randomBytes(32).toString("hex");
  const token = new Token({
    userId: existingUser._id,
    token: newToken,
  });

  const resetExpires = moment().add(1, "hour").toDate();
  // Store the reset token in the database
  existingUser.resetToken = token.token;
  existingUser.resetExpires = resetExpires;
  await existingUser.save();

  // Send an email to the user with the reset link
  const resetLink = `${process.env.BASE_URL}/users/reset-password/${newToken}`;
  const message = `Hello,\n\nYou have requested to reset your password. Please click the following link to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n`;
  sendMail(existingUser.email, "Password Reset Request", message);

  res.status(200).json({ message: "Reset email sent" });
};

const resetLink = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const user = await User.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() },
    });

    if (!user) {
      // Reset token is invalid or has expired
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }

    // Update the user's password and reset the resetToken and resetExpires fields in the database
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export default { login, resetPassword, resetLink };
