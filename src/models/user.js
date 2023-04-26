import mongoose from "mongoose";
import { MaritalStatus } from "../utils/enum/maritalStatus.enum";
import { GenderStatus } from "../utils/gender.enum";

// Define user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          v
        );
      },
      message:
        "Password must be at least 8 characters long and include a combination of uppercase and lowercase letters, numbers, and special characters.",
    },
  },
  profilePicture: { type: String },
  gender: {
    type: String,
    enum: GenderStatus,
  },
  age: { type: Number },
  dateOfBirth: { type: String },
  maritalStatus: { type: String, enum: MaritalStatus },
  nationality: { type: String },
  nationalId: { type: String, unique: true },
  passportId: { type: String, unique: true },
  nationalIdPicture: { type: String },
  passportPicture: { type: String },
});
const User = mongoose.model("User", userSchema);
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
export { User };
