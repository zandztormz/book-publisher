const express = require('express');
const router = express.Router();
const books = require('../controllers/books.controller');

router.route('/').get(books.index);

module.exports = router;
