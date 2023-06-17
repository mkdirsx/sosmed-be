const db = require('../models');
const user = db.user;
const post = db.post;
require('dotenv').config();

module.exports = {
    getAll: async(req, res) => {
        try {
            const result = await post.findAll({
                include: {
                    model: user,
                    attributes: ['id', 'username', 'profilePicture', 'status']
                }
            });

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

    getUserAll: async(req, res) => {
        try {
            const { id } = req.params;

            const result = await post.findAll({
                where: {
                    id: id
                },
                include: {
                    model: user,
                    attributes: ['id', 'username', 'profilePicture', 'status']
                }
            });

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
            const { caption, userId } = req.body;
            const filename = req?.file?.filename;

            await post.create({
               caption: caption,
               image: (filename)? process.env.POST + '/' + filename : null,
               userId: userId
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