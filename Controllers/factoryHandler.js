const APiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllDocs = (Model) =>
  catchAsync(async (req, res, next) => {
    let docQuery;
    if (req.params.tourId) {
      docQuery = new APiFeatures(
        Model.find({ tour: req.params.tourId }),
        req.query
      )
        .filter()
        .sort()
        .field()
        .limit()
        .page();
    } else {
      docQuery = new APiFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .field()
        .limit()
        .page();
    }
    const docs = await docQuery.query;
    res.status(200).json({
      message: "success",
      results: docs.length,
      docs,
    });
  });

exports.createDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc;
    if (req.params.tourId) {
      const { rating, review } = req.body;
      const { user } = req;
      const tour = req.params.tourId;
      doc = await Model.create({ rating, review, user, tour });
    } else {
      doc = await Model.create(req.body);
    }

    res.status(201).json({
      message: "success",
      doc,
    });
  });

exports.getDoc = (Model, populate) =>
  catchAsync(async (req, res, next) => {
    let doc = populate
      ? Model.findById(req.params.id).populate(populate)
      : Model.findById(req.params.id);

    if (req.params.tourId) {
      doc = null;
      doc = await Model.findById(req.params.id);
      console.log(req.params.id);
      console.log(doc);
      doc = doc.tour._id == req.params.tourId ? doc : null;
    } else {
      doc = await doc;
    }

    if (!doc) {
      return next(new AppError("doc not found", 404));
    }
    res.status(200).json({
      message: "success",
      doc,
    });
  });

exports.deleteDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("doc not found", 404));
    }

    res.status(204).json({
      message: "success",
    });
  });

exports.updateDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("doc not found", 404));
    }

    res.status(200).json({
      message: "success",
      doc,
    });
  });
