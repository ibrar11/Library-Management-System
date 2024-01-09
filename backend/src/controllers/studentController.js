const {books,students} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleAssign = async (req,res) => {
    try{
        const {bookId,rollNumber,assigningDate,returnDate} = req.body;
        if( !bookId ) {
            return res.status(404).json({"message":"Book id not found"});
        }
        const book = await books.findOne({where:{id:bookId}});
        if(book && req.body) {
            const studentToAssign = await students.findOne({where:{rollNumber}});
            if (studentToAssign) {
                book.studentId = studentToAssign.id;
                if(assigningDate){
                    book.assigningDate = assigningDate;
                    book.isBorrowed = true;
                }
                book.rollNumber = rollNumber;
                book.returnDate = returnDate;
                book.isRequested = true;
                book.save();
                return res.status(201).json({"message":"Book assigned"});
            }
            book.rollNumber = rollNumber;
            book.assigningDate = assigningDate;
            book.returnDate = returnDate;
            book.save();
            return res.status(201).json({"message":"Book assigned"});
        }
       return res.status(404).json({"message":"Missing Details"});
    }catch(err) {
        res.status(500).json({'message':err.message});
    }
};

const handleReturn = async (req,res) => {
    try{
        const {id} = req.params;
        const condition = !id || (Number(id) && Number(id)>0);
        if(!condition){
            return res.status(400).json({"message":"Id not found or wrong Id"});
        }else {
            const book = await books.findOne({where:{id}});
            if(book) {
                book.studentId = null;
                book.rollNumber = null;
                book.isBorrowed = false;
                book.assigningDate = null;
                book.returnDate = null;
                book.isRequested = false;
                book.save();
                return res.status(200).json({"message":"Return completed."});
            }else {
                return res.status(404).json({"message":"Book not Found."});
            }
        } 
    }catch(err) {
        res.status(500).json({'message':err.message});
    }
};

const getStudents = async (req,res) => {
    console.log("logged");
    try{
        const allStudents = await students.findAll({include: books});
        if(allStudents) {
            return res.status(201).json(allStudents);
        }
        return res.status(404).json({"message":"Students not found"});
    }catch(err) {
        res.status(500).json({'message':err.message});
    }
};

const getStudent = async (req,res) => {
    try {
        const {id} = req.params;
        if(id) {
            const student = await students.findOne({include: books, where: {uuid: id}});
            if(student) {
                return res.status(201).json(student);
            }
        }
        return res.sendStatus(404);
    } catch (err) {
        res.status(500).json({'message':err.message});   
    }
}

const updateStudent = async (req,res) => {
    try{
        const {uuid} = req.params;
        const {name,email, password} = req.body;
        const user = await students.findOne({
            where: {uuid}
        });
        if(!user){
            return res.status(400).json({"message":"User not found!"});
        }
        if(name){
             user.studentName = name;
        }
        if(email){
            user.email = email;
        }
        if(password){
            user.password = await bcrypt.hash(password,10);
        }
        await user.save();
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
        await user.update({refreshToken});
        res.cookie('jwt',refreshToken,{
            httpOnly: true, 
            maxAge:24*60*60*1000
        });
        return res.status(201).json(
            {
                accessToken,
                user
            }
        );
        
    }catch(err){
        res.status(500).json({"message":err.message});
    }
};

module.exports = {handleAssign,handleReturn,getStudents,updateStudent,getStudent};