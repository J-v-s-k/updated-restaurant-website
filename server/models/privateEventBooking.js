const mongoose = require('mongoose');

const privateEventBookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    occasion: { type: String },
    venueName: { type: String, required: true },
    price: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PrivateEventBooking', privateEventBookingSchema);