const {uploadPDF, getAllPDFs, getSinglePDF, deletePDF, updatePDF} = require('../controllers/pdf-controller.js');
const userSchema = require('../models/user-schema.js');
const PDFSchema = require('../models/pdf-schema.js');
const {StatusCodes} = require('http-status-codes');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'pdfs/');
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('File must be a pdf.'));
        }
    },
    filename: async function (req, file, cb) {
        const pdfId = await uploadPDF(req);
        cb(null, pdfId + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.route('/').get(getAllPDFs).post(upload.single('pdf'), async (req, res) => {
    const userId = req.user.id;
    const pdfs = await PDFSchema.find({creatorId: userId});
    const user = await userSchema.findById(userId);

    res.status(StatusCodes.OK).render('dashboard', {pdfs: pdfs, user: user});
})
router.route('/:id').get(getSinglePDF).post(updatePDF);
router.route('/delete/:id').post(deletePDF);

module.exports = router;