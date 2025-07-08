const { LENGTH_REQUIRED } = require('http-status-codes');
const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim : true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim : true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    }
},{timestamps : true})

module.exports = mongoose.model('user',userschema);