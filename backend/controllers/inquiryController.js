const Inquiry = require("../models/Inquiry");

// @desc    Create a new customer inquiry
// @route   POST /api/inquiries
exports.createInquiry =
  async (
    req,
    res,
  ) => {
    try {
      const newInquiry =
        await Inquiry.create(
          req.body,
        );
      res
        .status(
          201,
        )
        .json(
          {
            message:
              "Inquiry submitted successfully.",
            data: newInquiry,
          },
        );
    } catch (error) {
      console.error(
        "Error creating inquiry:",
        error,
      );
      res
        .status(
          400,
        )
        .json(
          {
            message:
              "Invalid inquiry data.",
            error:
              error.message,
          },
        );
    }
  };

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries
exports.getInquiries =
  async (
    req,
    res,
  ) => {
    try {
      // Sort by newest leads first
      const inquiries =
        await Inquiry.find().sort(
          {
            createdAt:
              -1,
          },
        );
      res
        .status(
          200,
        )
        .json(
          inquiries,
        );
    } catch (error) {
      console.error(
        "Error fetching inquiries:",
        error,
      );
      res
        .status(
          500,
        )
        .json(
          {
            message:
              "Server error fetching leads.",
          },
        );
    }
  };

// @desc    Update inquiry status (Admin)
// @route   PATCH /api/inquiries/:id
exports.updateInquiryStatus =
  async (
    req,
    res,
  ) => {
    try {
      const {
        status,
      } =
        req.body;
      const updatedInquiry =
        await Inquiry.findByIdAndUpdate(
          req
            .params
            .id,
          {
            status,
          },
          {
            returnDocument:
              "after",
            runValidators: true,
          },
        );

      if (
        !updatedInquiry
      ) {
        return res
          .status(
            404,
          )
          .json(
            {
              message:
                "Inquiry not found.",
            },
          );
      }
      res
        .status(
          200,
        )
        .json(
          updatedInquiry,
        );
    } catch (error) {
      console.error(
        "Error updating inquiry:",
        error,
      );
      res
        .status(
          400,
        )
        .json(
          {
            message:
              "Failed to update inquiry status.",
            error:
              error.message,
          },
        );
    }
  };
