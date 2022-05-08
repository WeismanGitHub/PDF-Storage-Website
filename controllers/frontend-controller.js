const PDFSchema = require('../models/pdf-schema.js');
const {getAllPDFs} = require('./pdf-controller.js');
const {StatusCodes} = require('http-status-codes');
const {getUser} = require('./user-controller.js');

const auth = (req, res) => {
    res.status(StatusCodes.OK).render('auth');
};

const dashboard = async (req, res) => {
    const userId = req.user.id;

    const pdfs = await getAllPDFs(userId);
    const user = await getUser(userId);

    res.status(StatusCodes.OK).render('dashboard', {pdfs: pdfs, user: user});
};

const updatePDF = async (req, res) => {
    const userId = req.user.id;

    await PDFSchema.findOne({_id: req.params.id, creatorId: userId})
    .then(async (doc, err) => {
        if (doc) {
            const user = await getUser(userId);
            
            res.status(StatusCodes.OK).render('update-pdf', {pdf: doc, user: user});
        } else {
            throw new Error("Access Denied");
        }
    });
};

module.exports = {
    dashboard,
    auth,
    updatePDF,
};