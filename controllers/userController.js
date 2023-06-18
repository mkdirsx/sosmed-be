const bcrypt = require('bcrypt');
const db = require('../models');
const user = db.user;
const post = db.post;
require('dotenv').config();

module.exports = {
    getAll: async(req, res) => {
        try {
            const result = await user.findAll({
                attributes: ['id', 'profilePicture', 'username', 'email', 'status']
            });

            return res.status(200).send({
                isError: false,
                message: 'GET Success',
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

            const result = await user.findOne({
                where: {
                    id: id
                },
                include: {
                    model: post
                },
                attributes: ['id', 'profilePicture', 'username', 'email', 'desc', 'status']
            });

            return res.status(200).send({
                isError: false,
                message: 'GET Success',
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

    login: async(req, res) => {
        try {
            const { username, password } = req.body;

            let result;

            if(username.includes('@')) {
                result = await user.findOne({
                    where: {
                        email: username
                    }
                });
            }
            else {
                result = await user.findOne({
                    where: {
                        username: username
                    }
                });
            }

            if(!result) {
                return res.status(400).send({
                    isError: true,
                    message: 'incorrect credentials !',
                    data: null
                });
            }

            const compare = await bcrypt.compare(password, result.password);

            if(!compare) {
                return res.status(400).send({
                    isError: true,
                    message: 'incorrect credentials !',
                    data: null
                });
            }

            return res.status(200).send({
                isError: false,
                message: `Welcome, ${result.username} !`,
                data: {
                    id: result.id,
                    profilePicture: result.profilePicture,
                    username: result.username,
                    email: result.email,
                    desc: result.desc,
                    status: result.status
                }
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

    createUser: async(req, res) => {
        try {
            const { username, email, password } = req.body;

            const existingUser = await user.findAll();
            
            for (let i of existingUser) {
                if(i.username === username) {
                    return res.status(400).send({
                        isError: true,
                        message: 'username taken !',
                        data: null
                    });
                }
                else if (i.email === email) {
                    return res.status(400).send({
                        isError: true,
                        message: 'email taken !',
                        data: null
                    });
                }
            }

            const hash = await bcrypt.hash(password, Number(process.env.SALT));
            const code = Math.floor(Math.random()*90000) + 10000;
            
            const result = await user.create({
               username: username,
               profilePicture: process.env.DEFAULT + '/PP-1686904860744.png',
               password: hash,
               email: email,
               desc: '',
               code: code,
               status: 'unverified' 
            });

            return res.status(200).send({
                isError: false,
                message: `${username} has been registered !`,
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

    updateUser: async(req, res) => {
        try {
            const { id } = req.params;
            const { username, desc } = req.body;
            const filename = req?.file?.filename;

            if(filename) {
                await user.update({
                    username: username,
                    desc : desc,
                    profilePicture: process.env.LINK + '/' + filename
                }, {
                    where: {
                        id: id
                    }
                });
            }
            else {
                await user.update({
                    username: username,
                    desc: desc
                }, {
                    where: {
                        id: id
                    }
                });
            }

            return res.status(200).send({
                isError: false,
                message: 'Changes saved !',
                data: null
            });
        }
        catch(error) {
            return res.status(500).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    }
}