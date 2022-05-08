const UserSchema = require('../models/user-schema.js');
const PDFSchema = require('../models/pdf-schema.js');
const {StatusCodes} = require('http-status-codes');
const path = require('path');
const fs = require('fs');

const getUser = async (id) => {
    const user = await UserSchema.findById(id);
    return user;
};

const deleteUser = async (req, res) => {
    const userId = req.user.id;

    PDFSchema.find({creatorId: userId}).select('+_id')
    .then((pdfIds)=> {
        pdfIds.forEach(pdfId => {
            fs.unlink(path.join(__dirname, '..', 'pdfs', `${pdfId}.pdf`), (err) => { 
                throw new Error('Error deleting file.');
            });
        });
    })
    .then(await UserSchema.findByIdAndDelete(userId))
    .then(res.status(StatusCodes.OK).render('auth'));
};

const updateUser = async (req, res) => {
    const userId = req.user.id;

    const user = await UserSchema.findByIdAndUpdate(
        userId,
        req.body,
        { new: true, runValidators: true }
    );

    const pdfs = await PDFSchema.find({creatorId: userId}).select('-__v -creatorId');

    res.status(StatusCodes.OK).render('user-account', {pdfs: pdfs, user: user});
};

module.exports = {
    getUser,
    deleteUser,
    updateUser,
};