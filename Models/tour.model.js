const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "provide a name please"],
      unique: [true, "this name already taken"],
      minlength: 4,
      maxlength: 24,
    },

    slug: String,

    duration: {
      type: Number,
      required: true,
    },

    maxGroupSize: {
      type: Number,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ["easy", "medium", "difficult"],
      },
    },

    ratingsAverage: {
      type: Number,
      required: true,
      max: 5,
      min: 1,
    },

    ratingsQuantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },

      coordinates: [Number],
      adresse: String,
      description: String,
    },

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        adresse: String,
        description: String,
      },
    ],

    summary: String,
    description: String,
    imageCover: String,
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ startLocation: "2dsphere" });
tourSchema.index({ price: 1, ratingsAverage: 1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v",
  });

  next();
});

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Tour", tourSchema);
