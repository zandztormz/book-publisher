const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const users = require('../controllers/users.controller');
const userFilter = require("../middleware/users.middleware")

router.route('/').post([
    check('username')
        .matches('[a-zA-Z0-9]$').withMessage('Invalid Username')
        .isLength({ min: 6 }).withMessage('Username must be at least 6 chars long'),
    check('name').not().isEmpty().withMessage('Name is not empty'),
    check('surname').not().isEmpty().withMessage('Surname is not empty'),
    check('date_of_birth').not().isEmpty().withMessage('Date of birth is not empty'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars long'),
], users.create);

router.use(userFilter.getUser);
router.route('/').get(users.index).delete(users.delete);
router.route('/orders').post(users.order)

module.exports = router;
