const {uploadPDF, getAllPDFs, getSinglePDF, deletePDF, updatePDF} = require('../controllers/pdf-controller.js');
const userSchema = require('../models/user-schema.js');
const PDFSchema = require('../models/pdf-schema.js');
const {StatusCodes} = require('http-status-codes');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'pdfs/');
    },
    filename: async function (req, file, callback) {
        const pdfId = await uploadPDF(req);
        callback(null, pdfId + path.extname(file.originalname));
    }
});

const fileFilter = function (req, file, callback) {
    if (file.mimetype == "application/pdf") {
        callback(null, true);
    } else {
        return callback(new Error('File must be a pdf.'));
    }
}

const upload = multer({storage: storage, fileFilter: fileFilter});

router.route('/').get(getAllPDFs).post(upload.single('pdf'), async (req, res) => {
    const userId = req.user.id;
    const pdfs = await PDFSchema.find({creatorId: userId});
    const user = await userSchema.findById(userId);

    res.status(StatusCodes.OK).render('dashboard', {pdfs: pdfs, user: user});
})
router.route('/:id').get(getSinglePDF).post(updatePDF);
router.route('/delete/:id').post(deletePDF);

module.exports = router;
