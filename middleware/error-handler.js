const {StatusCodes} = require('http-status-codes');
require('dotenv').config();

const errorHandler = (err, req, res, next) => {
    if (process.env.NOT_IN_PRODUCTION) {
        console.log(err);
    }
    
    res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).render('error-page', {error: err.message});
};

module.exports = errorHandler;