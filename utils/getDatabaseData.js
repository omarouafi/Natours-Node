const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Tour = require("../Models/tour.model");
const userModel = require("../Models/user.model");
const Review = require("../Models/review.model");
dotenv.config({ path: "../.env" });

const toursJson = JSON.parse(fs.readFileSync("../dev-data/data/tours.json"));
const usersJson = JSON.parse(fs.readFileSync("../dev-data/data/users.json"));
const reviewsJson = JSON.parse(
  fs.readFileSync("../dev-data/data/reviews.json")
);

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const createData = async () => {
  try {
    await Tour.create(toursJson);
    await Review.create(reviewsJson);
    await userModel.create(usersJson, {
      validateBeforeSave: false,
    });
    console.log("created");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

const removeData = async () => {
  try {
    await Tour.deleteMany();
    await userModel.deleteMany();
    await Review.deleteMany();
    console.log("deleted");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  createData();
} else if (process.argv[2] === "--delete") {
  removeData();
}
