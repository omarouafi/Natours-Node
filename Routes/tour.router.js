const express = require("express");
const { protect } = require("../Controllers/auth.controller");
const {
  getAllTours,
  createTour,
  getTour,
  deleteTour,
  updateTour,
  getTopTours,
  tourStats,
  tourPlans,
  getNear,
  getDistances,
  resizeImages,
  handleUpload,
} = require("../Controllers/tour.controller");
const reviewRouter = require("./review.router");

const tourRouter = express.Router();

tourRouter.use(protect);
tourRouter.use("/:tourId/reviews", reviewRouter);
tourRouter.get("/stats", tourStats);
tourRouter.get("/with/:distance/center/:lnglat/unit/:unit", getNear);
tourRouter.get("/center/:lnglat/unit/:unit", getDistances);
tourRouter.get("/stats/:year", tourPlans);
tourRouter.get("/top", getTopTours);
tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter
  .route("/:id")
  .get(getTour)
  .delete(deleteTour)
  .patch(handleUpload, resizeImages, updateTour);

module.exports = tourRouter;
