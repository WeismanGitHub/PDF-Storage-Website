const {getUser, deleteUser, updateUser,} = require('../controllers/user-controller.js');
const express = require('express');
const router = express.Router();

router.route('/:id').get(async (req, res) => {
    const user = await getUser(req.user.id);
    res.render('user-account', {user: user
    })
}).post(updateUser);
router.route('/delete/:id').post(deleteUser);

module.exports = router;