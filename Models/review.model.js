const mongoose = require('mongoose')
const Tour = require('./tour.model')

const reviewSchema = new mongoose.Schema({

    review:{
        type:String,
        required:true,
    },

    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:[true,"A review must belong to a user"],
    },

    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,"A review Tour must belong to a review"]
    }

})



reviewSchema.statics.updateTour = async function (tour) {
    
    const stats = await this.aggregate([
        {
            $match:{tour},
        },
        {
            $group:{
                _id:'$tour',
                nRatings:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ])
    await Tour.findByIdAndUpdate(tour,{ratingsAverage:stats[0].avgRating,ratingsQuantity:stats[0].nRatings})

}


reviewSchema.post('save',function () {
    this.constructor.updateTour(this.tour)
})


reviewSchema.pre(/^find/,function (next) {
    this.populate({
        path:'user',
        select:'name photo'
    })
    next()
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne()
    next()
})


reviewSchema.post(/^findOneAnd/,async function () {
    await this.r.constructor.updateTour(this.r.tour)
})






const Review = mongoose.model('Review',reviewSchema)

module.exports = Review
