const express = require('express');
const { checkSchema } = require('express-validator');
const { posts } = require('../controllers');

const router = express.Router();

// GET //
router.get('/', posts.getAll);

// POST //
router.post('/', posts.createPost);

module.exports = router;