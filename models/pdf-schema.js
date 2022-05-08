const mongoose = require('mongoose');

const PDFSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide a name.'],
        minLength: 1,
        maxLength: 50,
    },
    author: {
        type: String,
        required: [true, "Must provide an author name. Put 'unknown' if unknown."],
        minLength: 1,
        maxLength: 50,
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Must provide an uploader. (Server Issue)'],
        immutable: true
    }
});

module.exports = mongoose.model('PDFs', PDFSchema);