const jwt = require("jsonwebtoken");
const tourModel = require("../Models/tour.model");
const User = require("../Models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto");
const sharp = require("sharp");
const sendE = require("../utils/email");
const multer = require("multer");

const sendUser = (res, user, code) => {
  const token = jwt.sign({ id: user.id }, process.env.token);
  res.cookie("jwt", token, {
    secure: false,
  });
  res.status(code || 200).json({
    status: "success",
    user,
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  sendUser(res, user);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPass(password, user.password))) {
    return next(new AppError("invalid email or password", 400));
  }

  sendUser(res, user);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  const decoded = jwt.verify(token, process.env.token);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("invalid token", 401));
  }

  req.user = user;
  res.locals.user = user;

  next();
});

exports.isAuth = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next();
  }
  const decoded = await jwt.verify(token, process.env.token);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next();
  }
  res.locals.user = user;

  next();
});

exports.restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }
    next(new AppError("You are not allowed for this operation", 403));
  });

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("please provide email"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const resetLink = crypto.randomBytes(32).toString("hex");

  const hashedLink = crypto
    .createHash("sha256")
    .update(resetLink)
    .digest("hex");
  user.resetLink = hashedLink;

  await user.save({ validateBeforeSave: false });

  await sendE({ to: user.email, subject: "reset password", text: resetLink });

  res.status(200).json({
    message: "success",
  });
});

exports.resetpassword = catchAsync(async (req, res, next) => {
  const { link } = req.params;

  if (!link) {
    return next(new AppError("please provide the reset link"));
  }

  const hash = crypto.createHash("sha256").update(link).digest("hex");

  const user = await User.findOne({ resetLink: hash });

  if (!user) {
    return next(new AppError("the reset link is invalid"));
  }

  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm) {
    return next(new AppError("passwords doesn't match", 400));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.save();

  sendUser(res, user);
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only images", 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

exports.resizePics = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};

exports.ImgMulter = upload.single("photo");

exports.updateMe = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  let filteredBody = { name, email };
  if (req.file) {
    filteredBody = { ...filteredBody, photo: req.file.filename };
  }
  const id = req.user.id;

  const user = await User.findByIdAndUpdate(id, filteredBody, {
    runValidators: true,
    new: true,
  });
  sendUser(res, user);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordConfirm, password, oldPassword } = req.body;

  if (
    !password ||
    !passwordConfirm ||
    !oldPassword ||
    password !== passwordConfirm
  ) {
    return next(new AppError("please provide all the infos", 400));
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.checkPass(oldPassword, user.password))) {
    return next(new AppError("invalid password", 400));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  sendUser(res, user);
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  sendUser(res, user, 204);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "logount", {
    expires: new Date(Date.now() + 100),
  });

  res.status(200).json({
    status: "success",
    message: "logged out",
  });
});
