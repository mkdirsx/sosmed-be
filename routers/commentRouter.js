const express = require('express');
const { checkSchema } = require('express-validator');
const { comments }= require('../controllers');

const router = express.Router();

// POST //
router.post('/', comments.createComment);

module.exports = router;
