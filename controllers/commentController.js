const db = require('../models');
const DBcomment = db.comment;

module.exports = {
    createComment: async(req, res) => {
        try {
            const { userId, postId, comment } = req.body;

            await DBcomment.create({
                userId: userId,
                postId: postId,
                comment: comment
            });

            return res.status(200).send({
                isError: false,
                message: 'Comment posted !',
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

    updateComment: async(req, res) => {
        try {
            const { newComment } = req.body;
            const { id } = req.params;

            await DBcomment.update({
                comment: newComment
            }, {
                where: {
                    id: id
                }
            });

            return res.status(200).send({
                isError: false,
                message: 'Comment updated !',
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