const bcrypt = require('bcrypt');
const transporter = require('../transport/transport');
const handlebars = require('handlebars');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('../models');
const user = db.user;
const post = db.post;
const like = db.like;
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

            let result = await user.findOne({
                where: {
                    id: id
                },
                include: [ 
                    {
                        model: post
                    },
                    {
                        model: like
                    }
                ],
                attributes: ['id', 'profilePicture', 'username', 'email', 'desc', 'status']
            });

            const censorWord = (str) => {
                return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
            }
             
            const censorEmail = (email) => {
                 var arr = email.split("@");
                 return censorWord(arr[0]) + "@" + censorWord(arr[1]);
            }

            result.email = censorEmail(result.email);

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
                    },
                    include: [ 
                        {
                            model: like
                        }
                    ]
                });
            }
            else {
                result = await user.findOne({
                    where: {
                        username: username
                    },
                    include: [ 
                        {
                            model: like
                        }
                    ]
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

            const censorWord = (str) => {
                return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
            }
             
            const censorEmail = (email) => {
                 var arr = email.split("@");
                 return censorWord(arr[0]) + "@" + censorWord(arr[1]);
            }

            const censoredEmail = censorEmail(result.email);
            const token = jwt.sign(
                {
                    id: result.id,
                    status: result.status,
                },
                process.env.KEY,
                {
                    expiresIn: '12h'
                }
            )

            return res.status(200).send({
                isError: false,
                message: `Welcome, ${result.username} !`,
                data:{
                    user: {
                        id: result.id,
                        profilePicture: result.profilePicture,
                        username: result.username,
                        email: censoredEmail,
                        desc: result.desc,
                        status: result.status,
                        likes: result.likes
                    },
                    token: token
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
            
            const result = await user.create({
               username: username,
               profilePicture: process.env.DEFAULT + '/PP-1686904860744.png',
               password: hash,
               email: email,
               desc: '',
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
            const { username, desc, status } = req.body;
            const filename = req?.file?.filename;

            if(status !== 'verified') {
                return res.status(400).send({
                    isError: true,
                    message: 'user must be verified to comment !',
                    data: null
                });
            }
            
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
    },

    sendEmail: async(req, res) => {
        try {
            const { id } = req.params;
            const verify = Math.floor(Math.random()*90000) + 10000;
            
            const recipient = await user.findOne({
                where: {
                    id: id
                }
            });

            if(!recipient) {
                return res.status(400).send({
                    isError: true,
                    message: 'Error: no recipient!',
                    data: null
                });
            }

            await user.update({
                code: verify
            }, {
                where: {
                    id: id
                }
            });
            
            const template = handlebars.compile(
                fs.readFileSync('./Public/templates/verifyEmail.html', {
                    encoding: 'utf-8'
                })
            );

            const domain = `localhost:3000`;
            const path = `$2y$10$Xe2xcXHL7.faauuauzNaOuNuWwIffUCfXT0u9Wh25uPj7IoMzJhte`;
            const code = verify;
            const data = {
                "username": recipient.username,
                "domain": domain,
                "path": path,
                "code": code
            }

            const emailTemplate = template(data);
            
            transporter.sendMail({
               from: 'nodemailer',
               to: `${recipient.email}`,
               subject: 'Account Verification',
               html: emailTemplate
            })
            return res.status(200).send({
                isError: false,
                message: 'Email has been sent !',
                data: emailTemplate
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

    verifyAccount: async(req, res) => {
        try {
            const { code } = req.body;
            const { id } = req.params;

            const existingUser = await user.findOne({
                where: {
                    id: id
                }
            });

            if(!existingUser) {
                return res.status(400).send({
                    isError: true,
                    message: 'Bad request !',
                    data: null
                });
            }

            if(existingUser.code === Number(code)) {
                await user.update({
                    status: 'verified',
                }, {
                    where: {
                        id: id
                    }
                })
            }
            else {
                return res.status(400).send({
                    isError: true,
                    message: 'Bad request !',
                    data: null
                });
            }

            return res.status(200).send({
                isError: false,
                message: 'Account Verified !',
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