const {books,students} = require('../models');

const addBook = async (req,res) => {
    try{
        const {bookName,edition,authorName,publishDate} = req.body;
        const condition = bookName && edition && authorName && publishDate;
        if(!condition) {
            return res.status(404).json({'message':'details is missing'});
        }
        const book = await books.create({bookName,edition,authorName,publishDate});
        res.status(201).json({'message': "Book Added",book});
    }catch (err) {
        res.status(500).json({'message':err.message});
    }
};

const getBooks = async (req,res) => {
    try{
        const allBooks = await books.findAll(
            {
                include: students
            }
        );
        if(allBooks) {
            return res.status(201).json(allBooks);
        }
        return res.status(404).json({"message":"Books not found"});
    }catch(err) {
        res.status(500).json({'message':err.message});
    }
};

const updateBook = async (req,res) => {
    try{
        const { id } = req.params;
        const {bookName,edition,authorName,publishDate,issueDate,returnDate} = req.body;
        const book = await books.findOne( 
            {
                where: {id} 
            } 
        );
        if(book) {
            book.bookName = bookName;
            book.edition = edition;
            book.authorName = authorName;
            book.publishDate = publishDate;
            book.issueDate = issueDate;
            book.returnDate = returnDate;
            book.save();
                return res.status(201).json({'message': "update complete",book});
        }
        return res.status(404);
    }catch(err) {
        return res.status(500).json({'message':err.message});
    }
};

const deleteBook = async (req,res) => {
    try{
        const { id } = req.params;
        const book = await books.findOne(
            {
                where: {id}
            }
        );
        if( book ) {
            await book.destroy();
            return res.status(201).json({"message": "Book Deleted"});
        }
        return res.status(404).json({"message": "Book not found"}); 
    } catch(err) {
        res.status(500).json({'message':err.message});
    }
};

module.exports = {addBook , updateBook, getBooks, deleteBook}