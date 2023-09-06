const express = require("express");
const {
  createReivew,
  getReview,
  getReviews,
  updateReview,
  deleteReview,
  setProductIdAndUserIdToBody,
  createFilterObject,
} = require("../Services/ReviewsServices");

const auth = require("../Services/AuthService");
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/Validation/ReviewsValidation");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    auth.protect,
    auth.allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReivew
  )
  .get(createFilterObject, getReviews);

router
  .route("/:id")
  .get(auth.protect, auth.allowedTo("user"), getReviewValidator, getReview)
  .put(
    auth.protect,
    auth.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    auth.protect,
    auth.allowedTo("user", "admin", "manger"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
