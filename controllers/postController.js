const db = require('../models');
const user = db.user;
const post = db.post;
const like = db.like;
const comment = db.comment;
require('dotenv').config();

module.exports = {
    getAll: async(req, res) => {
        try {
            const { page } = req.query;
            const limit = 5;
            
            const result = await post.findAndCountAll({
                include: [
                    {
                        model: user,
                        attributes: ['id', 'username', 'profilePicture', 'status', 'createdAt']
                    },
                    {
                        model: like
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: limit * page || limit
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
            const { page } = req.query;
            const limit = 5;
            
            const result = await post.findAndCountAll({
                where: {
                    userId: id
                },
                include: [
                    {
                        model: user,
                        attributes: ['id', 'username', 'profilePicture', 'status']
                    },
                    {
                        model: like
                    }
                ],
                order: [
                    ['createdAt', 'ASC']
                ],
                limit: limit * page || limit
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

    getOne: async(req, res) => {
        try {           
            const { id } = req.params; 
            const result = await post.findOne({
                include: [
                    {
                        model: user,
                        attributes: ['id', 'username', 'profilePicture', 'status', 'createdAt']
                    },
                    {
                        model: like
                    },
                    {
                        model: comment,
                        include: {
                            model: user,
                            attributes: ['id', 'username', 'profilePicture', 'status', 'createdAt']
                        }
                    }
                ],
                where: {
                    id: id
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
    },

    updatePost: async(req, res) => {
        try {
            const { id } = req.params;
            const { newMessage } = req.body;
            
            await post.update({
                caption: newMessage
            }, {
                where: {
                    id: id
                }
            });

            return res.status(200).send({
                isError: false,
                message: 'Post updated !',
                data: null
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

    deletePost: async(req, res) => {
        try {
            const { id } = req.params;
            
            await post.destroy({
                where: {
                    id: id
                }
            });

            return res.status(200).send({
                isError: false,
                message: 'Post deleted !',
                data: null
            });
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