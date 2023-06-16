const express = require('express');
const router = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const { profilePicture } = require('../middleware/multer');
const { users } = require('../controllers');


// GET //

// POST //
router.post('/', async(req, res, next) => {
    await checkSchema({
        'username': {
            errorMessage: 'username cannot be empty !',
            notEmpty: true
        },
        'password': {
            errorMessage: 'password cannot be empty !',
            notEmpty: true
        },
        'email': {
            errorMessage: 'email must be valid !',
            isEmail: true
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
}, users.createUser);

router.post('/login', async(req, res, next) => {
    await checkSchema({
        'username': {
            errorMessage: 'username cannot be empty !',
            notEmpty: true
        },
        'password': {
            errorMessage: 'password cannot be empty',
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
}, users.login);

module.exports = router;
