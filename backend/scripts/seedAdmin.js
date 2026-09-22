const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const seedAdmin =
  async () => {
    try {
      await mongoose.connect(
        process
          .env
          .MONGO_URI,
      );

      const adminEmail =
        process
          .env
          .ADMIN_EMAIL ||
        "admin@dealer.com";
      const adminPassword =
        process
          .env
          .ADMIN_PASSWORD ||
        "DealerPass2026!";

      // Check if admin already exists
      const existingUser =
        await User.findOne(
          {
            email:
              adminEmail,
          },
        );
      if (
        existingUser
      ) {
        console.log(
          `Admin account (${adminEmail}) already exists.`,
        );
        process.exit(
          0,
        );
      }

      // Create Dealer Admin
      await User.create(
        {
          email:
            adminEmail,
          password:
            adminPassword,
          role: "admin",
        },
      );

      console.log(
        "-----------------------------------------",
      );
      console.log(
        "DEALER ADMIN CREATED SUCCESSFULLY",
      );
      console.log(
        `Email:    ${adminEmail}`,
      );
      console.log(
        `Password: ${adminPassword}`,
      );
      console.log(
        "-----------------------------------------",
      );

      process.exit(
        0,
      );
    } catch (error) {
      console.error(
        "Error seeding admin:",
        error,
      );
      process.exit(
        1,
      );
    }
  };

seedAdmin();
