const tourModel = require("../Models/tour.model");
const catchAsync = require("../utils/catchAsync");
const dotenv = require("dotenv");
const Booking = require("../Models/booking.model");
dotenv.config({ path: "../.env" });

exports.checkoutHandler = catchAsync(async (req, res, next) => {
  const stripe = require("stripe")(process.env.STRIPE);
  const tour = await tourModel.findById(req.params.id);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${tour._id}&user=${
      req.user.id
    }&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/${tour.slug}`,
    customer_email: req.user.email,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        amount: tour.price * 100,
        currency: "usd",
        images: ["https://www.natours.dev/img/tours/tour-2-cover.jpg"],
        quantity: 1,
      },
    ],
  });
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.bookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) {
    return next();
  }

  await Booking.create({ tour, user, price });
  next();
});
