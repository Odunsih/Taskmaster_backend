import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [false, "Please provide your name"],
    },

    email: {
      type: String,
      required: [true, "Please an email"],
      unique: true,
      trim: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add password!"],
    },

    photo: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/19819005?v=4",
    },

    bio: {
      type: String,
      default: "I am a new user.",
    },

    role: {
      type: String,
      enum: ["user", "admin", "creator"],
      default: "admin",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    title: { type: String, required: false },
    description: { type: String, required: false },
    dueDate: { type: Date },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // New field
  },
  { timestamps: true, minimize: true }
);

// hash the password before saving
UserSchema.pre("save", async function (next) {
  // check if the password is not modified
  if (!this.isModified("password")) {
    return next();
  }

  // hash the password  ==> bcrypt
  // generate salt
  const salt = await bcrypt.genSalt(10);
  // hash the password with the salt
  const hashedPassword = await bcrypt.hash(this.password, salt);
  // set the password to the hashed password
  this.password = hashedPassword;

  // call the next middleware
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
