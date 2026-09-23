const express = require("express");
const router =
  express.Router();
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const {
  upload,
} = require("../config/cloudinary");

// Map endpoints to controller methods
router
  .route(
    "/",
  )
  .get(
    getCars,
  )
  .post(
    upload.fields(
      [
        {
          name: "images",
          maxCount: 10,
        },
        {
          name: "video",
          maxCount: 1,
        },
      ],
    ),
    createCar,
  );;

router
  .route(
    "/:id",
  )
  .get(
    getCarById,
  )
  .put(
    upload.fields(
      [
        {
          name: "images",
          maxCount: 10,
        },
        {
          name: "video",
          maxCount: 1,
        },
      ],
    ),
    updateCar,
  )
  .delete(
    deleteCar,
  );

module.exports =
  router;
