const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req,res,next) => {

    const cookie = req.cookies;
    if(!cookie?.jwt) {
        return res.sendStatus(401);
    };

    const token = cookie.jwt;

    jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded) => {
            if(err) {
                return res.sendStatus(403);
            }
            req.userUUID = decoded.userUUID;
            next();
        }
    )
};

module.exports = verifyJWT;