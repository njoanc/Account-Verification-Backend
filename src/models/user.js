import mongoose from "mongoose";
import { MaritalStatus } from "../utils/enum/maritalStatus.enum";
import { GenderStatus } from "../utils/gender.enum";
import { AccountState } from "../utils/enum/accountState";
import bcrypt from "bcrypt";

// Define user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid password. Password must be alphanumeric and between 8 and 12 characters.`,
      },
    },
  },
  profilePicture: { type: String },
  gender: {
    type: String,
    enum: GenderStatus,
  },
  age: { type: Number },
  accountState: {
    type: String,
    enum: AccountState,
    default: AccountState.UNVERIFIED,
  },
  dateOfBirth: { type: String },
  maritalStatus: { type: String, enum: MaritalStatus },
  nationality: { type: String },
  nationalId: {
    type: String,
    validate: {
      validator: function (v) {
        return /^1([9][5-9]|[0-9][0-9])\d{8}$/.test(v);
      },
      message: "Invalid Rwandan national ID format",
    },
  },
  passportId: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[A-Z]{2}[A-Z0-9]{3,20}$/.test(v);
      },
      message: "Invalid passport ID format",
    },
  },

  nationalIdPicture: { type: String },
  passportPicture: { type: String },
  isEmailVerified: { type: Boolean, default: false },
});

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);

export default User;
