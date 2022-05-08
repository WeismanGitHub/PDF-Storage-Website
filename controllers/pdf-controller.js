const PDFSchema = require('../models/pdf-schema.js');
const {StatusCodes} = require('http-status-codes');
const {getUser} = require('./user-controller.js');
const path = require('path');
const fs = require('fs');

const uploadPDF = async (req) => {
    //The logic for the storage of the pdf itself is in the router.
    const pdf = await PDFSchema.create({...req.body, creatorId: req.user.id});
    return pdf._id;
};

const getAllPDFs = async (userId) => {
    const pdfs = await PDFSchema.find({creatorId: userId}).select('-__v -creatorId');
    return pdfs;
};

const getSinglePDF = async (req, res) => {
    await PDFSchema.find({_id: req.params.id, creatorId: req.user.id}).then((doc, err) => {
        if (doc) {
            res.status(StatusCodes.OK).sendFile(path.join(__dirname, '..', 'pdfs', `${req.params.id}.pdf`));
        } else {
            throw new Error("Access Denied");
        }
    });
};

const deletePDF = async (req, res) => {
    const creatorId = req.user.id;
    const pdfId = req.params.id;

    await PDFSchema.findOneAndDelete({creatorId: creatorId, _id: pdfId}).then((doc, err) => {
        if (doc) {
            fs.unlink(path.join(__dirname, '..', 'pdfs', `${pdfId}.pdf`), (err) => { 
                if (err) {
                    throw new Error('Error deleting file.');
                }
            });
        }
    });

    const user = await getUser(creatorId);
    const pdfs = await getAllPDFs(creatorId);

    res.status(StatusCodes.OK).render('dashboard', {pdfs: pdfs, user: user});
};

//You're only able to edit the name and author of the pdf entry because I'm lazy.
const updatePDF = async (req, res) => {
    const creatorId = req.user.id;

    await PDFSchema.findOneAndUpdate(
        {_id: req.params.id, creatorId: creatorId},
        req.body,
        { new: true, runValidators: true }).then(async (doc, err) => {
            if (doc) {
                const pdfs = await getAllPDFs(creatorId);
                const user = await getUser(creatorId);
                res.status(StatusCodes.OK).render('dashboard', {pdfs: pdfs, user: user});
            } else {
            throw new Error("Access Denied");
        }
    });
};

module.exports = {
    uploadPDF,
    getAllPDFs,
    getSinglePDF,
    deletePDF,
    updatePDF,
};
