const users = require('./userRouter');
const posts = require('./postRouter');
const likes = require('./likeRouter');
const comments = require('./commentRouter');

module.exports = {
    users,
    posts,
    likes,
    comments
}
