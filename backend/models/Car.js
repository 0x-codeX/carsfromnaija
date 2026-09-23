const mongoose = require("mongoose");

const carSchema =
  new mongoose.Schema(
    {
      title:
        {
          type: String,
          required: true,
          trim: true,
        },
      make: {
        type: String,
        required: true,
        trim: true,
      },
      model:
        {
          type: String,
          required: true,
          trim: true,
        },
      year: {
        type: Number,
        required: true,
      },
      category:
        {
          type: String,
          trim: true,
          enum: [
            "Regular",
            "Hybrid",
            "Electric",
            "Luxury",
            "Exotic",
            "",
          ],
          default:
            "Regular",
        },
      priceUSD:
        {
          type: Number,
          required: true,
        },
      priceNGN:
        {
          type: Number,
          required: true,
        },
      status:
        {
          type: String,
          enum: [
            "available",
            "sold",
          ],
          default:
            "available",
        },
      isNegotiable:
        {
          type: Boolean,
          default: true,
        },
      specs:
        {
          mileage:
            {
              type: Number,
              required: true,
            },
          transmission:
            {
              type: String,
              required: true,
            },
          engineType:
            {
              type: String,
              required: true,
            },
          vin: {
            type: String,
            trim: true,
            uppercase: true,
          },
          color:
            {
              type: String,
              trim: true,
            },
        },
      features:
        [
          {
            type: String,
          },
        ],
      images:
        [
          {
            url: {
              type: String,
              required: true,
            },
            public_id:
              {
                type: String,
              }, // Needed to delete images from Cloudinary
          },
        ],
      mainImage:
        {
          type: String,
          required: true,
        },
      video:
        {
          url: {
            type: String,
          },
          public_id:
            {
              type: String,
            },
        },
    },
    {
      timestamps: true,
    },
  );

module.exports =
  mongoose.model(
    "Car",
    carSchema,
  );
