const Setting = require("../models/Setting");

// @desc    Get global platform settings
// @route   GET /api/settings
exports.getSettings =
  async (
    req,
    res,
  ) => {
    try {
      let settings =
        await Setting.findOne();

      // If no settings exist yet, return a safe default so the frontend doesn't crash
      if (
        !settings
      ) {
        settings =
          {
            exchangeRateUSDToNGN: 1550,
            standardShippingUSD: 2500,
            standardClearingNGN: 3500000,
            dealerPhoneWhatsApp:
              "2348000000000",
            dealerEmail:
              "admin@yoursite.com",
            priceGuides:
              [], // Added fallback
          };
      }
      res
        .status(
          200,
        )
        .json(
          settings,
        );
    } catch (error) {
      console.error(
        "Error fetching settings:",
        error,
      );
      res
        .status(
          500,
        )
        .json(
          {
            message:
              "Server error while fetching configuration.",
          },
        );
    }
  };

// @desc    Update global platform settings
// @route   PUT /api/settings
exports.updateSettings =
  async (
    req,
    res,
  ) => {
    try {
      // Upsert: Updates the first document it finds. If none exists, it creates one.
      const updatedSettings =
        await Setting.findOneAndUpdate(
          {},
          req.body,
          {
            new: true,
            upsert: true,
            runValidators: true,
          },
        );
      res
        .status(
          200,
        )
        .json(
          updatedSettings,
        );
    } catch (error) {
      console.error(
        "Error updating settings:",
        error,
      );
      res
        .status(
          400,
        )
        .json(
          {
            message:
              "Failed to update configuration.",
            error:
              error.message,
          },
        );
    }
  };
