const db = require('../models');
const post = db.post;
require('dotenv').config();

module.exports = {
    getAll: async(req, res) => {
        try {
            const result = await post.findAll();

            return res.status(200).send({
                isError: false,
                message: 'GET success !',
                data: result
            });
        }
        catch(error) {
            return res.status(500).send({
                isError: true,
                message: error.message,
                data: null
            });
        }
    },

    createPost: async(req, res) => {
        try {
            const { caption } = req.body;
            const filename = req?.file?.filename;

            await post.create({
                caption: caption,
                image: (filename)? process.env.LINK + '/' + filename : null
            })

            return res.status(201).send({
                isError: true,
                message: 'new post created !',
                data: null
            })
        }
        catch(error) {
            return res.status(500).send({
                isError: true,
                message: error.message,
                data: null
            });
        }
    }
}