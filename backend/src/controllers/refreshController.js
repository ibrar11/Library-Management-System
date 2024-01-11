const {students} = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const refreshToken = async (req,res) => {
    try{
        const cookie = req.cookies;
        if(!cookie?.jwt) {
            return res.sendStatus(401);
        }
        const refreshToken = cookie.jwt;
        const user = await students.findOne({where:{refreshToken}});
        if(!user) return res.sendStatus(403);
        jwt.verify (
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || user.uuid !== decoded.userUUID ) {
                    return res.sendStatus(403);
                }
                const accessToken = jwt.sign (
                    {"userUUID": user.uuid},
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1m' }
                );
                res.json(
                    {
                        accessToken,
                        user: {
                            uuid: user.uuid,
                            role: user.role
                        }
                    }
                );
            }
        );
    }catch(err) {
        res.status(500).json({"message":err.message});
    }
};

module.exports = {refreshToken};