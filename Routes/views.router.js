const express = require("express");
const { isAuth, protect } = require("../Controllers/auth.controller");
const { bookingCheckout } = require("../Controllers/booking.controller");
const {
  Overview,
  tour,
  loginView,
  account,
  myBookings,
} = require("../Controllers/views.controller");

const viewsRouter = express.Router();

viewsRouter.use(isAuth);

viewsRouter.route("/").get(bookingCheckout, Overview);
viewsRouter.route("/bookings").get(protect, myBookings);
viewsRouter.route("/login").get(loginView);
viewsRouter.route("/me").get(protect, account);
viewsRouter.route("/:slug").get(tour);

module.exports = viewsRouter;
