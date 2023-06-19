const express = require('express');
const { checkSchema, validationResult } = require('express-validator');
const { comments }= require('../controllers');

const router = express.Router();

// POST //
router.post('/', async(req, res, next) => {
    await checkSchema({
        'comment': {
            errorMessage: 'Comment cannot be empty !',
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
}, comments.createComment);

// PATCH //
router.patch('/:id', async(req, res, next) => {
    await checkSchema({
        'newComment': {
            errorMessage: 'Comment cannot be empty !',
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
}
, comments.updateComment);

module.exports = router;
