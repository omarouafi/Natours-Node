const express = require("express");
const { protect } = require("../Controllers/auth.controller");
const { checkoutHandler } = require("../Controllers/booking.controller");

const router = express.Router();

router.get("/checkout/:id", protect, checkoutHandler);

module.exports = router;
