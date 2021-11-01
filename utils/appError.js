class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.statusCode = code;
    this.isOperational = true;
    this.status = `${this.statusCode}`.startsWith("4") ? "error" : "fail";
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
