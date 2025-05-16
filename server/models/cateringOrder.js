const mongoose = require('mongoose');

const cateringOrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  eventDate: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true },
  menuSelection: { type: String, required: true },
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CateringOrder', cateringOrderSchema);