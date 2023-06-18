const db = require('../models');
const post = db.post;
const user = db.user;
const like = db.like;

module.exports = {
    getAllFromPost: async(req, res) => {
        try {
            const postId = req.params.id;

            const result = await like.findAndCountAll({
                include: [
                    {
                        model: user,
                        attributes: ['id', 'username', 'profilePicture', 'status', 'createdAt']
                    },
                    {
                        model: post
                    }
                ],
                where: {
                    postId: postId
                }
            })

            return res.status(200).send({
                isError: false,
                message: 'GET success !',
                data: result
            })
        }
        catch(error) {
            return res.status(500).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },

    userLike: async(req, res) => {
        try {
            const { postId, userId } = req.body;

            const existingLikes = await like.findOne({
                where: {
                    userId: userId,
                    postId: postId
                }
            });

            if(existingLikes) {
                await like.destroy({
                    where: {
                        id: existingLikes.id
                    }
                })
                return res.status(200).send({
                    isError: false,
                    message: 'Post unliked !',
                    data: null
                })
            }
            else {
                await like.create({
                    userId: userId,
                    postId: postId
                })
                return res.status(200).send({
                    isError: false,
                    message: 'Post liked !',
                    data: null
                })
            }
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