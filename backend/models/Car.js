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
      trim: {
        type: String,
        trim: true,
        default:
          "",
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
          exteriorColor:
            {
              type: String,
              required: true,
              trim: true,
            },
          interiorColor:
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
          default:
            "/logo.png",
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
      condition:
        {
          type: String,
          enum: [
            "Foreign Used",
            "Registered",
            "Brand New",
          ],
          default:
            "Foreign Used",
        },
      bodyType:
        {
          type: String,
          enum: [
            "Sedan",
            "SUV",
            "4 door Coupe",
            "2 Door coupe",
            "Crossover",
            "Truck",
            "Pick Up",
            "",
          ],
          default:
            "",
        },
      location:
        {
          type: String,
          default:
            "Lagos",
          trim: true,
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
