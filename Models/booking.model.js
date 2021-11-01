const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({

    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:['true',"A booking should belong to a tour"]
    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:['true',"A booking should belong to a User"]
    },

    price:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})



const Booking = mongoose.model('Booking',bookingSchema)

module.exports = Booking

