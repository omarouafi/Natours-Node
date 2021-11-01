const catchAsync = require("../utils/catchAsync");
const User = require("../Models/user.model");
const {
  getAllDocs,
  createDoc,
  updateDoc,
  deleteDoc,
  getDoc,
} = require("./factoryHandler");

exports.getAllUsers = getAllDocs(User);
exports.createUser = createDoc(User);
exports.updateUser = updateDoc(User);
exports.deleteUser = deleteDoc(User);
exports.getUser = getDoc(User);
