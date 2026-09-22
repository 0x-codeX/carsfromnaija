const express = require("express");
const router =
  express.Router();
const RecentSale = require("../models/RecentSale");

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

// POST: Add a new recent sale
router.post(
  "/",
  async (
    req,
    res,
  ) => {
    try {
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
            soldAt:
              req
                .body
                .soldAt ||
              Date.now(),
          },
        );

      const savedSale =
        await newSale.save();
      res
        .status(
          201,
        )
        .json(
          savedSale,
        );
    } catch (error) {
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

// DELETE: Remove a recent sale from the showcase
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
