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
    upload.array(
      "images",
      5,
    ),
    createCar,
  );

router
  .route(
    "/:id",
  )
  .get(
    getCarById,
  )
  .put(
    upload.array(
      "images",
      5,
    ),
    updateCar,
  )
  .delete(
    deleteCar,
  );

module.exports =
  router;
