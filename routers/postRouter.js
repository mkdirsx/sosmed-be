const express = require('express');
const { checkSchema, validationResult } = require('express-validator');
const { posts } = require('../controllers');
const { postImage } = require('../middleware/multerPost');

const router = express.Router();

// GET //
router.get('/', posts.getAll);
router.get('/:id', posts.getUserAll);

// POST //
router.post('/', postImage.single('image'), async(req, res, next) => {
    await checkSchema({
        'caption': {
            errorMessage: 'post must contain a message',
            notEmpty: true
        },
        'userId' : {
            errorMessage: 'userId cannot be empty',
            notEmpty: true
        }
    }).run(req);

    const result = validationResult(req);
    if(!result.isEmpty()) {
        return res.status(400).send({
            isError: true,
            message: result.errors,
            data: null
        });
    }
    else {
        next();
    }
}, posts.createPost);

module.exports = router;