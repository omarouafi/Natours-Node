const {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
} = require("../Controllers/user.controller");

const express = require("express");
const {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetpassword,
  updateMe,
  updatePassword,
  deleteMe,
  logout,
  ImgMulter,
  resizePics,
  handleFacebookLogin,
  handleFacebookLoginCallBack,
  handleGoogleLoginCallBack,
  handleGoogleLogin,
} = require("../Controllers/auth.controller");

const userRouter = express.Router();

userRouter.route("/signup").post(signup);
userRouter.route("/logout").post(logout);
userRouter.route("/me/password").patch(protect, updatePassword);
userRouter
  .route("/me")
  .patch(protect, ImgMulter, resizePics, updateMe)
  .delete(protect, deleteMe);
userRouter.route("/forgotpassword").patch(forgotPassword);
userRouter.route("/reset/:link").patch(resetpassword);
userRouter.route("/login").post(login);
userRouter
  .route("/")
  .get(protect, getAllUsers)
  .post(protect, restrictTo("admin"), createUser);
userRouter.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

userRouter.route("/auth/facebook/login").get(handleFacebookLogin);
userRouter.route("/auth/facebook").get(handleFacebookLoginCallBack);
userRouter.route("/auth/google/login").get(handleGoogleLogin);
userRouter.route("/auth/google").get(handleGoogleLoginCallBack);

module.exports = userRouter;
