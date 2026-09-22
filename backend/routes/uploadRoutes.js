const express = require("express");
const router =
  express.Router();
const multer = require("multer");
const {
  uploadToCloudinary,
} = require("../config/cloudinary");
const {
  protect,
} = require("../middleware/authMiddleware");

// Store file in memory temporarily
const upload =
  multer({
    storage:
      multer.memoryStorage(),
  });

router.post(
  "/",
  protect,
  upload.single(
    "image",
  ),
  async (
    req,
    res,
  ) => {
    try {
      if (
        !req.file
      ) {
        return res
          .status(
            400,
          )
          .json(
            {
              message:
                "No image file provided.",
            },
          );
      }

      // Upload directly to Cloudinary
      const result =
        await uploadToCloudinary(
          req
            .file
            .buffer,
        );

      // Return the generated URL
      res
        .status(
          200,
        )
        .json(
          {
            url: result.secure_url,
            public_id:
              result.public_id,
          },
        );
    } catch (error) {
      console.error(
        "Upload error:",
        error,
      );
      res
        .status(
          500,
        )
        .json(
          {
            message:
              "Image upload failed.",
          },
        );
    }
  },
);

module.exports =
  router;
