const mongoose = require('mongoose')

const collageSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    fullName:{
        type: String,
        required: true,
    },
    logoLink:{
        type: String
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Collages', collageSchema)

