const multer = require("multer");
const sharp = require("sharp");
const Tour = require("../Models/tour.model");
const APiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const {
  getAllDocs,
  getDoc,
  createDoc,
  deleteDoc,
  updateDoc,
} = require("./factoryHandler");

exports.getTopTours = async (req, res) => {
  try {
    const sortString = "-ratingsAverage price";

    const tours = await Tour.find().sort(sortString).limit(5);

    res.status(200).json({
      status: "success",
      results: tours.length,
      tours,
    });
  } catch (error) {
    res.status(500).json({
      status: "err",
      error,
    });
  }
};

exports.createTour = createDoc(Tour);
exports.getAllTours = getAllDocs(Tour);
exports.getTour = getDoc(Tour, "reviews");
exports.updateTour = updateDoc(Tour);
exports.deleteTour = deleteDoc(Tour);

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      return cb(null, true);
    } else {
      return cb(new AppError("Please upload only images", 400), false);
    }
  },
});

exports.handleUpload = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (
    req.files &&
    req.files.imageCover != undefined &&
    req.files.images != undefined
  ) {
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);

    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (el, id) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${id + 1}.jpeg`;
        await sharp(el.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${filename}`);
        req.body.images.push(filename);
      })
    );
  }
  next();
});

exports.tourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },

    {
      $group: {
        _id: "$difficulty",
        ratingsAverage: { $avg: "$ratingsAverage" },
        ratingsQuantity: { $sum: "$ratingsQuantity" },
        averagePrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);

  res.status(200).json({
    message: "success",
    stats,
  });
});

exports.tourPlans = catchAsync(async (req, res) => {
  const year = req.params.year * 1;

  const tours = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: "$startDates" },
        tours: { $push: "$name" },
        number: { $sum: 1 },
        price: { $avg: "$price" },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },

    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    message: "success",
    tours,
  });
});

exports.getNear = catchAsync(async (req, res, next) => {
  const { distance, lnglat, unit } = req.params;

  if (!distance || !lnglat) {
    return next(new AppError("please provide all the infos", 400));
  }

  const [lat, lng] = lnglat.split(",");
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: tours.length,
    tours,
  });
});
exports.getDistances = catchAsync(async (req, res, next) => {
  const { lnglat, unit } = req.params;
  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  if (!lnglat) {
    return next(new AppError("please provide all the infos", 400));
  }

  const [lat, lng] = lnglat.split(",");

  const tours = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: tours.length,
    tours,
  });
});
