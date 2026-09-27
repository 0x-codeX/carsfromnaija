const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken =
  (
    id,
  ) => {
    return jwt.sign(
      {
        id,
      },
      process
        .env
        .JWT_SECRET,
      {
        expiresIn:
          "7d",
      },
    );
  };

exports.loginAdmin =
  async (
    req,
    res,
  ) => {
    const {
      email,
      password,
    } =
      req.body;
    try {
      const user =
        await User.findOne(
          {
            email,
          },
        ).select(
          "+password",
        );
      if (
        user &&
        (await user.matchPassword(
          password,
        ))
      ) {
        res.json(
          {
            _id: user._id,
            email:
              user.email,
            role: user.role,
            token:
              generateToken(
                user._id,
              ),
          },
        );
      } else {
        res
          .status(
            401,
          )
          .json(
            {
              message:
                "Invalid email or password.",
            },
          );
      }
    } catch (error) {
      res
        .status(
          500,
        )
        .json(
          {
            message:
              "Server error during authentication.",
          },
        );
    }
  };

// @desc    Get current logged in user details
exports.getMe =
  async (
    req,
    res,
  ) => {
    const user =
      await User.findById(
        req
          .user
          .id,
      );
    res
      .status(
        200,
      )
      .json(
        user,
      );
  };

// @desc    Update email, backup email, or password
exports.updateCredentials =
  async (
    req,
    res,
  ) => {
    const {
      email,
      backupEmail,
      currentPassword,
      newPassword,
    } =
      req.body;

    const user =
      await User.findById(
        req
          .user
          .id,
      ).select(
        "+password",
      );

    // If changing password, verify current password first
    if (
      newPassword
    ) {
      if (
        !currentPassword
      ) {
        return res
          .status(
            400,
          )
          .json(
            {
              message:
                "Please provide your current password to set a new one.",
            },
          );
      }
      if (
        !(await user.matchPassword(
          currentPassword,
        ))
      ) {
        return res
          .status(
            401,
          )
          .json(
            {
              message:
                "Current password is incorrect.",
            },
          );
      }
      user.password =
        newPassword;
    }
    if (
      backupEmail !==
      undefined
    )
      user.backupEmail =
        backupEmail;

    await user.save();
    res
      .status(
        200,
      )
      .json(
        {
          message:
            "Security credentials updated securely.",
        },
      );
  };

// @desc    Forgot Password - Emails token
exports.forgotPassword =
  async (
    req,
    res,
  ) => {
    const user =
      await User.findOne(
        {
          $or: [
            {
              email:
                req
                  .body
                  .email,
            },
            {
              backupEmail:
                req
                  .body
                  .email,
            },
          ],
        },
      );

    if (
      !user
    )
      return res
        .status(
          404,
        )
        .json(
          {
            message:
              "No user found with that email.",
          },
        );

    const resetToken =
      user.getResetPasswordToken();
    await user.save(
      {
        validateBeforeSave: false,
      },
    );

    // Must match your React frontend URL
    const resetUrl = `${req.headers.origin}/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please go to this link to securely set a new password: \n\n ${resetUrl}`;

    try {
      await sendEmail(
        {
          email:
            user.email, // Always send to primary for maximum security
          subject:
            "Admin Dashboard Password Reset",
          message,
        },
      );
      res
        .status(
          200,
        )
        .json(
          {
            message:
              "Reset link sent to primary email address.",
          },
        );
    } catch (err) {
      user.resetPasswordToken =
        undefined;
      user.resetPasswordExpire =
        undefined;
      await user.save(
        {
          validateBeforeSave: false,
        },
      );
      res
        .status(
          500,
        )
        .json(
          {
            message:
              "Email could not be sent. Check SMTP configuration.",
          },
        );
    }
  };

// @desc    Reset Password via Token
exports.resetPassword =
  async (
    req,
    res,
  ) => {
    const resetPasswordToken =
      crypto
        .createHash(
          "sha256",
        )
        .update(
          req
            .params
            .token,
        )
        .digest(
          "hex",
        );

    const user =
      await User.findOne(
        {
          resetPasswordToken,
          resetPasswordExpire:
            {
              $gt: Date.now(),
            },
        },
      );

    if (
      !user
    )
      return res
        .status(
          400,
        )
        .json(
          {
            message:
              "Invalid or expired token.",
          },
        );

    user.password =
      req.body.password;
    user.resetPasswordToken =
      undefined;
    user.resetPasswordExpire =
      undefined;
    await user.save();

    res
      .status(
        200,
      )
      .json(
        {
          message:
            "Password updated successfully.",
        },
      );
  };
