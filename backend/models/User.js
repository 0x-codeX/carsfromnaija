const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema =
  new mongoose.Schema(
    {
      email:
        {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true,
        },
      backupEmail:
        {
          type: String,
          lowercase: true,
          trim: true,
          default:
            null,
        },
      password:
        {
          type: String,
          required: true,
          select: false, // Security: Do not return password by default in queries
        },
      role: {
        type: String,
        default:
          "admin",
      },
      resetPasswordToken:
        String,
      resetPasswordExpire:
        Date,
    },
    {
      timestamps: true,
    },
  );

// Hash password before saving to MongoDB
userSchema.pre(
  "save",
  async function (
    next,
  ) {
    if (
      !this.isModified(
        "password",
      )
    ) {
      next();
    }
    const salt =
      await bcrypt.genSalt(
        10,
      );
    this.password =
      await bcrypt.hash(
        this
          .password,
        salt,
      );
  },
);

// Compare input password with hashed DB password
userSchema.methods.matchPassword =
  async function (
    enteredPassword,
  ) {
    return await bcrypt.compare(
      enteredPassword,
      this
        .password,
    );
  };

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken =
  function () {
    const resetToken =
      crypto
        .randomBytes(
          20,
        )
        .toString(
          "hex",
        );

    this.resetPasswordToken =
      crypto
        .createHash(
          "sha256",
        )
        .update(
          resetToken,
        )
        .digest(
          "hex",
        );

    this.resetPasswordExpire =
      Date.now() +
      10 *
        60 *
        1000; // 10 Minutes
    return resetToken;
  };

module.exports =
  mongoose.model(
    "User",
    userSchema,
  );
