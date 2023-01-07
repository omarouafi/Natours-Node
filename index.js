const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const tourRouter = require("./Routes/tour.router");
const errorController = require("./Controllers/error.controller");
const AppError = require("./utils/appError");
const userRouter = require("./Routes/user.router");
const rateLimiting = require("express-rate-limit");
const path = require("path");
const helmet = require("helmet");
const xss = require("xss-clean");
const san = require("express-mongo-sanitize");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const reviewRouter = require("./Routes/review.router");
const viewsRouter = require("./Routes/views.router");
const router = require("./Routes/booking.router");
dotenv.config();

const app = express();
const limiter = rateLimiting({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "too many requests",
});

// app.use(helmet())
app.use("/api", limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(san())
// app.use(xss())
app.use(
  hpp({
    whitelist: ["price", "duration"],
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/booking", router);

app.use("/", viewsRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`this route ${req.originalUrl} is not found`));
});

app.use(errorController);

port = process.env.PORT || 3004;

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected"))
  .catch((e) => {
    console.log(e.message);
  });

const server = app.listen(port, () => {
  console.log("server started");
});
