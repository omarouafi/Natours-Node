const Review = require("../Models/review.model");
const {
  getAllDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  createDoc,
} = require("./factoryHandler");

exports.getAllReviews = getAllDocs(Review);
exports.getReview = getDoc(Review);
exports.deleteReview = deleteDoc(Review);
exports.updateReview = updateDoc(Review);
exports.createReview = createDoc(Review);
