const AppError = require("../utils/appError");

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });
};

const handleCast = (err) => {
  return new AppError(`invalid ${err.path} : ${err.value}`, 400);
};

const handleDuplicate = (err) => {
  return new AppError(`Duplicate Field "${err.keyValue.name}"`, 400);
};

const handleValidation = (err) => {
  return new AppError(`invalid values`, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (`${process.env.NODE_ENV}`.startsWith("production")) {
    let error = { ...err };

    if (err.message.startsWith("Cast")) error = handleCast(error);
    if (err.code === 11000) error = handleDuplicate(error);
    if (`${err._message}`.endsWith("validation failed"))
      error = handleValidation(error);

    sendProdError(error, res);
  } else {
    sendDevError(err, res);
  }
};
