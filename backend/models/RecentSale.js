// Inside models/RecentSale.js
const mongoose = require("mongoose");

const recentSaleSchema =
  new mongoose.Schema(
    {
      title:
        {
          type: String,
          required: true,
        },
      priceNGN:
        {
          type: Number,
          required: true,
        },
      image:
        {
          type: String,
        },
      imagePublicId:
        {
          type: String,
          default:
            null,
        },
      soldAt:
        {
          type: Date,
          default:
            Date.now,
        },
    },
    {
      timestamps: true,
    },
  );

module.exports =
  mongoose.model(
    "RecentSale",
    recentSaleSchema,
  );
