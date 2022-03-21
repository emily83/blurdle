const mongoose = require('mongoose');

const PictureSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Please enter date']
    },
    url: {
        type: String,
        required: [true, 'Please enter URL']
    },
    answer: {
        type: String,
        trim: true,
        required: [true, 'Please enter answer']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Picture', PictureSchema);