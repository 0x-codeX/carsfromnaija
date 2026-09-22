const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
