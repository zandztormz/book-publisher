const express = require('express');
const router = express.Router();
const authen = require('../controllers/authen.controller');

router.route('/login').post(authen.login)

module.exports = router;
