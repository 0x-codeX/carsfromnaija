const mongoose = require("mongoose");

const inquirySchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      phone:
        {
          type: String,
          required: true,
          trim: true,
        },
      email:
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      type: {
        type: String,
        required: true,
      }, // e.g., 'Car Specific' or 'Budget Search'
      target:
        {
          type: String,
          required: true,
        }, // e.g., '2022 Toyota Hilux' or 'SUV - ₦15M Budget'
      budgetNGN:
        {
          type: Number,
        }, // Optional, mostly for Budget Searches
      preferredCategory:
        {
          type: String,
        },
      status:
        {
          type: String,
          enum: [
            "Pending",
            "Contacted",
          ],
          default:
            "Pending",
        },
    },
    {
      timestamps: true,
    },
  );

module.exports =
  mongoose.model(
    "Inquiry",
    inquirySchema,
  );
