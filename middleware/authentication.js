const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        throw new Error('Authentication Invalid');
    } try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id: payload.userId, name: payload.name};
        next();
    } catch (error) {
        res.status(StatusCodes.NETWORK_AUTHENTICATION_REQUIRED).render('auth');
    }
};

module.exports = auth;