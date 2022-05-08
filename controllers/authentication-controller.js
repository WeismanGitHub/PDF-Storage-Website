const {getAllPDFs} = require('../controllers/pdf-controller.js')
const {getUser} = require('../controllers/user-controller.js')
const UserSchema = require('../models/user-schema.js')
const {StatusCodes} = require('http-status-codes')

const register = async (req, res) => {
    const user = await UserSchema.create(req.body)
    const token = user.createJWT()

    req.user = user
    req.user.id = user.id
    const pdfs = await getAllPDFs(user._id)
    
    res.status(StatusCodes.CREATED)
    .cookie('token', token)
    .render('dashboard',  {pdfs: pdfs, user: user})
}

const login = async (req, res) => {
    const {email, password} = req.body
    
    if (!email || !password) {
        throw new Error('Must provide email and password.')
    }

    const user = await UserSchema.findOne({email})

    if (!user) {
        throw new Error('Invalid Credentials')
    }

    const isPasswordCorrect = await user.checkPassword(password)

    if (!isPasswordCorrect) {
        throw new Error('Invalid Credentials')
    }
    
    const token = user.createJWT()
    req.user = user
    req.user.id = user._id
    const pdfs = await getAllPDFs(user._id)

    res.status(StatusCodes.OK)
    .cookie('token', token)
    .render('dashboard',  {pdfs: pdfs, user: user})
}

module.exports = {
    register,
    login,
}