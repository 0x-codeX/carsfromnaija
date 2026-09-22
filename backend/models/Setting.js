const mongoose = require("mongoose");

const settingSchema =
  new mongoose.Schema(
    {
      exchangeRateUSDToNGN:
        {
          type: Number,
          required: true,
        },
      standardShippingUSD:
        {
          type: Number,
          required: true,
        },
      standardClearingNGN:
        {
          type: Number,
          required: true,
        },
      dealerPhoneWhatsApp:
        {
          type: String,
          required: true,
        },
      dealerEmail:
        {
          type: String,
          required: true,
        },
      priceGuides:
        [
          {
            make: {
              type: String,
              required: true,
            },
            model:
              {
                type: String,
                required: true,
              },
            yearStart:
              {
                type: Number,
                required: true,
              },
            yearEnd:
              {
                type: Number,
                required: true,
              },
            priceMinNGN:
              {
                type: Number,
                required: true,
              },
            priceMaxNGN:
              {
                type: Number,
                required: true,
              },
            imageUrl:
              {
                type: String,
                required: true,
              }, // NEW: Direct link to CDN image
            category:
              {
                type: String,
                enum: [
                  "Regular",
                  "Hybrid",
                  "Electric",
                  "Luxury",
                  "Exotic",
                ], // UPDATED
                default:
                  "Regular",
              },
          },
        ],
    },
    {
      timestamps: true,
    },
  );

module.exports =
  mongoose.model(
    "Setting",
    settingSchema,
  );
