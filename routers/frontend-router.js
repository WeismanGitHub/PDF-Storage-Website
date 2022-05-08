const {auth, dashboard, updatePDF,} = require('../controllers/frontend-controller.js');
const authMiddleware = require('../middleware/authentication.js');
const express = require('express');
const router = express.Router();

router.route('/pdfupdate/:id').get(authMiddleware, updatePDF);
router.route('/dashboard').get(authMiddleware, dashboard);
router.route('/').get(auth);

module.exports = router;