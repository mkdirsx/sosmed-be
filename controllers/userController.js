const bcrypt = require('bcrypt');
const db = require('../models');
const user = db.user;
require('dotenv').config();

module.exports = {
    getAll: async(req, res) => {
        try {
            const result = await user.findAll({
                attributes: ['id', 'username', 'email', 'status']
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
                attributes: ['id', 'username', 'email', 'status']
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
                message: 'GET Success',
                data: {
                    id: result.id,
                    username: result.username,
                    email: result.email,
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
            const { username, email, password} = req.body;

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

            const result = await user.create({
               username: username,
               password: hash,
               email: email,
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
    }
}