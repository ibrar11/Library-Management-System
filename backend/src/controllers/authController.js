const {students} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email && !password) {
            return res.sendStatus(404);
        }
        const user = await students.findOne({where:{email}});
        if(!user) {
            return res.status(404).json({"message":"User not found!"});
        }
        const match = await bcrypt.compare(password,user.password);
        if(match) { 
            const accessToken = jwt.sign(
                {'userUUID': user.uuid},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m'}
            );
            const refreshToken = jwt.sign(
                {'userUUID': user.uuid},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d'}
            );
            user.refreshToken = refreshToken;
            await user.save();
            res.cookie('jwt',refreshToken,{
                httpOnly: true, 
                maxAge:24*60*60*1000
            });
            res.json(
                {
                    accessToken,
                    user: {
                        uuid: user.uuid,
                        role: user.role
                    }
                }
            );
        }else {
            return res.status(401).json({"message":"wrong password!"});
        }
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

const handleLogout = async (req,res) => {
    try{
            // on Client, also delete the accessToken

    const cookie = req.cookies;
    if(!cookie?.jwt) {
        const {uuid} = req.body;
        if(uuid) {
            const user = await students.findOne({where : {uuid}});
            user.refreshToken = '';
            await user.save();
        } 
        return res.sendStatus(204);
    }
    const refreshToken = cookie.jwt;
    const user = await students.findOne({where : {refreshToken}});

    if(!user) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    user.refreshToken = '';
    await user.save();
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
    }catch(err) {
        res.status(500).json({"message":err.message});
    }
}

module.exports = {handleLogin,handleLogout};