import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },

  referenceNumber: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  verified: {
    type: Boolean,
    default: false,
  },

  meterID: {
    type: String,
    required: true,
    unique: true,
  },

  darkMode: {
    type: Boolean,
    default: false,
  },

  otp: Number,
  otp_expires: Date,
  resetPasswordOTP: Number,
  resetPasswordExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getJwtToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.COOKIE_EXPIRE * 60 * 24 * 60 * 1000,
  });

  return token;
};

userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.generatePasswordResetToken = async function () {
  // Generate a random reset token
  const resetToken = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.RESET_PASSWORD_EXPIRE * 60 * 60 * 1000,
  });

  // Save the reset token to the user document
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpires = new Date(Date.now() + process.env.RESET_PASSWORD_EXPIRE * 60 * 60 * 1000);

  await this.save({ validateBeforeSave: false });

  return resetToken;
};

userSchema.methods.matchResetToken = async function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this._id.equals(decoded._id);
  } catch (err) {
    return false;
  }
};

userSchema.methods.changePassword = async function (password) {
  this.password = password;
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;

  await this.save();
};

userSchema.index({ otp_expires: 1 }, { expireAfterSeconds: 0 });

export const User = mongoose.model("User", userSchema);
