const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true
    },
    email: {
    type: String,
    required: true,
    unique: true
    },
    mobile: {
    type: String,
    required: true,
    unique: true
    },
    password: {
    type: String,
    required: true
    },
    category: {
    type: String,
    required: true,
    enum: ['consumer', 'supplier', 'driver'],
    default: 'consumer'
    }
});

module.exports = mongoose.model('SupplyChain', userSchema);