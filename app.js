const authMiddleware = require('./middleware/authentication.js');
const errorHandler = require('./middleware/error-handler.js');
const rateLimiter = require('express-rate-limit');
const connectDB = require('./db/connect.js');
const compression = require('compression');
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
require('express-async-errors');
const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const authRouter = require('./routers/authentication-router.js');
const frontendRouter = require('./routers/frontend-router.js');
const userRouter = require('./routers/user-router.js');
const pdfRouter = require('./routers/pdf-router.js');
const cookieParser = require('cookie-parser');

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1/users', authMiddleware, userRouter);
app.use('/api/v1/pdfs', authMiddleware, pdfRouter);
app.use('/api/v1/authentication', authRouter);
app.use('/', frontendRouter);

app.use(errorHandler);

const start = async () => {
    try {
        connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is starting on ${port}...`));
    } catch (error) {
        if (process.env.NOT_IN_PRODUCTION) {
            console.log(error);
        }
    }
};

start();