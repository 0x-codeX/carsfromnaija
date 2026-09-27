const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/User");

const seedAdmin =
  async () => {
    try {
      await mongoose.connect(
        process
          .env
          .MONGO_URI,
      );

      const actualEmail =
        "obong@carsfromnaija.com.ng"; // Replace with real email
      const initialPassword =
        "YourSecurePassword123!"; // Replace with initial password

      // Check if an existing admin account exists
      let user =
        await User.findOne(
          {
            role: "admin",
          },
        );

      if (
        user
      ) {
        user.email =
          actualEmail;
        user.password =
          initialPassword; // pre('save') hook will hash this automatically
        await user.save();
        console.log(
          `✅ Existing Admin email updated to: ${actualEmail}`,
        );
      } else {
        await User.create(
          {
            email:
              actualEmail,
            password:
              initialPassword,
            role: "admin",
          },
        );
        console.log(
          `✅ New Admin account created with email: ${actualEmail}`,
        );
      }

      process.exit(
        0,
      );
    } catch (error) {
      console.error(
        "❌ Failed to seed admin user:",
        error,
      );
      process.exit(
        1,
      );
    }
  };

seedAdmin();
