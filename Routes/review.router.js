const express = require("express");
const {
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
} = require("../Controllers/review.controller");

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.route("/").get(getAllReviews).post(createReview);
reviewRouter
  .route("/:id")
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);

module.exports = reviewRouter;
