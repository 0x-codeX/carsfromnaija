const express = require("express");
const router =
  express.Router();
const {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
} = require("../controllers/inquiryController");

router
  .route(
    "/",
  )
  .get(
    getInquiries,
  )
  .post(
    createInquiry,
  );

router
  .route(
    "/:id",
  )
  .patch(
    updateInquiryStatus,
  );

module.exports =
  router;
