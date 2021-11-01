const mongoose = require("mongoose");
const validatorjs = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [true, "this name is already taken"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (val) {
        return validatorjs.isEmail(val);
      },
      message: "please enter a valid email",
    },
  },

  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "guide", "admin", "tour-guide"],
    },
  },

  active: {
    type: Boolean,
    default: true,
  },

  photo: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "the passwords should match",
    },
  },

  passwordChangedAt: Date,
  resetLink: String,
  resetLinkExpiresAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.checkPass = function (password, hashedpassword) {
  return bcrypt.compare(password, hashedpassword);
};

userSchema.methods.checkToken = function (iat) {};

module.exports = mongoose.model("User", userSchema);
