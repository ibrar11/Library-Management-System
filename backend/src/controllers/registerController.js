const {students,books} = require('../models');
const bcrypt = require('bcrypt');
const {Op} = require('sequelize');

const handleRegister = async (req,res) => {
    try{
        const {name,email,password,rollNumber} = req.body;
        if(name && email && password) {
            const user = await students.findOne({where:{email}});
            if(!user) {
                const hashPassword = await bcrypt.hash(password,10);
                const user = await students.create({studentName:name,email,password:hashPassword,role:4757,rollNumber});
                const book = await books.findOne({where:{
                    [Op.and]: [
                        {
                            rollNumber: {
                                [Op.eq]: user.rollNumber
                            }
                        },
                        {
                            studentId: {
                                [Op.is]: null
                            }
                        },
                    ]
                }});
                if(book) {
                    book.isRequested = true;
                    book.studentId = user.id;
                    book.save();
                }
                return res.status(201).json({"message":"Registered successfully!",user});
            }else {
                return res.status(409).json({"message":"Email already exists!"});
            }
        }
        return res.status(404).json({"message":"Details missing!"});
    }catch(err) {
        return res.status(500).json({"message":err.message});
    }
}

module.exports = {handleRegister}