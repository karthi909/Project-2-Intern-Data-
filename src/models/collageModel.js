const mongoose = require('mongoose')

const collageSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    fullName:{
        type: String,
        required: true,
        trim: true
    },
    logolink:{
        type: String,
        required: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Collages', collageSchema)

