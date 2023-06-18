const express = require('express');
const { likes } = require('../controllers');

const router = express.Router();

// GET //
router.get('/:id', likes.getAllFromPost);

// POST //
router.post('/', likes.userLike);

module.exports = router;