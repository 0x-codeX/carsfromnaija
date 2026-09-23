const express = require("express");
const router =
  express.Router();
const RecentSale = require("../models/RecentSale");
const {
  cloudinary,
} = require("../config/cloudinary");

// GET: Fetch up to 3 most recent sales
router.get(
  "/",
  async (
    req,
    res,
  ) => {
    try {
      const sales =
        await RecentSale.find()
          .sort(
            {
              soldAt:
                -1,
            },
          )
          .limit(
            3,
          );
      res.json(
        sales,
      );
    } catch (error) {
      res
        .status(
          500,
        )
        .json(
          {
            message:
              "Server error fetching recent sales",
          },
        );
    }
  },
);

router.post(
  "/",
  async (
    req,
    res,
  ) => {
    try {
      // 1. Create the new sale, explicitly mapping imagePublicId
      const newSale =
        new RecentSale(
          {
            title:
              req
                .body
                .title,
            priceNGN:
              req
                .body
                .priceNGN,
            image:
              req
                .body
                .image,
            imagePublicId:
              req
                .body
                .imagePublicId ||
              null,
            soldAt:
              req
                .body
                .soldAt ||
              Date.now(),
          },
        );

      const savedSale =
        await newSale.save();

      // 2. Strict Auto-Pruning logic
      const MAX_RECENT_SALES = 3;
      const currentSalesCount =
        await RecentSale.countDocuments();

      if (
        currentSalesCount >
        MAX_RECENT_SALES
      ) {
        // Find all sales older than the newest 3
        const oldestSales =
          await RecentSale.find()
            .sort(
              {
                soldAt:
                  -1,
              },
            )
            .skip(
              MAX_RECENT_SALES,
            );

        for (const oldSale of oldestSales) {
          // If it was a dashboard transfer and has an image on Cloudinary, destroy it
          if (
            oldSale.imagePublicId
          ) {
            await cloudinary.uploader.destroy(
              oldSale.imagePublicId,
            );
          }
          // Remove it from the database
          await RecentSale.findByIdAndDelete(
            oldSale._id,
          );
        }
      }

      res
        .status(
          201,
        )
        .json(
          savedSale,
        );
    } catch (error) {
      console.error(
        "Recent Sale Error:",
        error,
      );
      res
        .status(
          400,
        )
        .json(
          {
            message:
              "Failed to add recent sale",
            error,
          },
        );
    }
  },
);


router.delete(
  "/:id",
  async (
    req,
    res,
  ) => {
    try {
      const sale =
        await RecentSale.findByIdAndDelete(
          req
            .params
            .id,
        );
      if (
        !sale
      ) {
        return res
          .status(
            404,
          )
          .json(
            {
              message:
                "Sale not found",
            },
          );
      }
      res.json(
        {
          message:
            "Sale removed successfully",
        },
      );
    } catch (error) {
      res
        .status(
          500,
        )
        .json(
          {
            message:
              "Server error deleting sale",
          },
        );
    }
  },
);

module.exports =
  router;
