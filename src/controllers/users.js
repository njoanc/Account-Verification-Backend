import bcrypt from "bcrypt";
import httpStatus from "http-status";
import User from "../models/user";
import Token from "../models/token";
import sendMail from "../utils/sendMail";
import crypto from "crypto";
import { AccountState } from "../utils/enum/accountState";

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

    await User.updateOne({ _id: user._id }, { isEmailVerified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("Email verified successfully");
  } catch (error) {
    res.status(400).send("An error occurred");
  }
};

const accountVerification = async (req, res) => {
  const { userId } = req.params;
  const { nationalId, passportNumber } = req.body;
  const { nationalIdPic, passportPic } = req.files || {};

  try {
    let updatedFields = {
      nationalId: nationalId,
      passportNumber: passportNumber,
      accountState: AccountState.PENDING,
    };

    if (nationalIdPic) {
      const nationalIdPicLocation = nationalIdPic[0].Location;
      updatedFields.nationalIdPic = nationalIdPicLocation;
      updatedFields.accountState = AccountState.VERIFIED;
      await saveFileLocationToDatabase(
        userId,
        "nationalIdPic",
        nationalIdPicLocation
      );
    }

    if (passportPic) {
      const passportPicLocation = passportPic[0].Location;
      updatedFields.passportPic = passportPicLocation;
      updatedFields.accountState = AccountState.VERIFIED;
      await saveFileLocationToDatabase(
        userId,
        "passportPic",
        passportPicLocation
      );
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });
    const message = `Dear ${updatedUser.name},Your account has been verified`;
    await sendMail(updatedUser.email, "Account Verification", message);
    return res.status(200).json({ messaged: "Your account has been verified" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

async function saveFileLocationToDatabase(userId, fieldName, fileLocation) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User with id ${userId} not found`);
      return;
    }

    user[fieldName] = fileLocation;
    await user.save();
  } catch (err) {
    console.error(
      `Error saving ${fieldName} location to database for user ${userId}`,
      err
    );
  }
}

export default { createUser, verifyEmail, accountVerification };
