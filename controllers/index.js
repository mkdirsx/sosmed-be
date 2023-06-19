const users = require('./userController');
const posts = require('./postController');
const likes = require('./likeController');
const comments = require('./commentController');

module.exports = {
    users,
    posts,
    likes,
    comments
}