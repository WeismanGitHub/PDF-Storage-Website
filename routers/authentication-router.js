const {register, login,} = require('../controllers/authentication-controller.js');
const express = require('express');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);

module.exports = router;