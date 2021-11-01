const Booking = require("../Models/booking.model");
const tourModel = require("../Models/tour.model");
const catchAsync = require("../utils/catchAsync");

exports.Overview = catchAsync(async (req, res, next) => {
  let tours = await tourModel.find();
  res.status(200).render("overview", {
    tours,
  });
});
exports.tour = catchAsync(async (req, res, next) => {
  const tour = await tourModel
    .findOne({ slug: req.params.slug })
    .populate("reviews");
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.loginView = catchAsync(async (req, res, next) => {
  res.status(200).render("login");
});

exports.account = catchAsync(async (req, res, next) => {
  res.status(200).render("account");
});

exports.myBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  const ids = bookings.map((el) => el.tour);

  const tours = await tourModel.find({ _id: { $in: ids } });

  res.status(200).render("overview", {
    tours,
  });
});
