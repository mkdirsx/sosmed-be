const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    isOwner: (req, res, next) => {
        try {
            let token = req.headers.authorization;
            const { userId } = req.body;
            
            if(!token) {
                return res.status(400).send({
                    isError: true,
                    message: 'unauthorized access !',
                    data: null
                })
            };

            token = token.split(' ')[1];
            const verify = jwt.verify(token, process.env.KEY);
            
            if(verify.id !== userId) {
                return res.status(400).send({
                    isError: true,
                    message: 'unauthorized access !',
                    data: null
                });
            }
            next();
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