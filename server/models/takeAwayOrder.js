const mongoose = require('mongoose');

const takeAwayOrderSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    pickupTime: { type: String, required: true },
    orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TakeAwayOrder', takeAwayOrderSchema);
