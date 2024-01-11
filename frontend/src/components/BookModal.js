import React, { useState } from 'react'

const BookModal = (props) => {

    const [bookName , setBookName] = useState(props.book ? props.book.bookName : '');
    const [edition , setEdition] = useState(props.book ? props.book.edition : '');
    const [authorName , setAuthorName] = useState(props.book ? props.book.authorName : '');
    const [publishDate , setPublishDate] = useState(props.book ? props.book.publishDate : '');
    const [issueDate , setIssueDate] = useState(props.book ? props.book.assigningDate : null);
    const [returnDate , setReturnDate] = useState(props.book ? props.book.returnDate : null);
    const [isBorrowed , setIsBorrowed] = useState(props.book ? props.book.isBorrowed : false);
    const [allowClick , setAllowClick] = useState(false);

    const goBack = (e) => {
        e.preventDefault();
        setBookName('');
        setEdition('');
        setAuthorName('');
        setPublishDate('');
        setIssueDate(null);
        setReturnDate(null);
        setIsBorrowed(false); 
        setAllowClick (false);
        if(props.book?.id){
            props.setBookId(null)
            props.setEditModal(false);
        }else {
            props.setIsModalOpen(false);
        }
    }

    const addBook = (e) => {
        e.preventDefault();
        const condtition = bookName && edition && authorName && publishDate && !allowClick
        if (condtition){
            const book = {
                bookName,
                edition,
                authorName,
                publishDate,
                issueDate,
                returnDate,
                id: props.book?.id
            };
            const result =  props.handleSubmit(book);
            setAllowClick(result);
        }
    }

    const openAssignModal = (e) => {
        e.preventDefault();
        props.setId(props.bookId)
        props.setAssignModal(true);
    }

    return (
        <div className='BookModal'>
            <div className='addBookModal'>
            <form id='bookForm' onSubmit={(e)=>(addBook(e))}>
                <div 
                className="close-btn">
                <button
                    onClick = {(e)=>(goBack(e))}
                >
                    &times;
                </button>
                </div>
                <div className='formHeader'>
                    {props.book?.id ? "Edit Book Details" :"ADD NEW BOOK"}
                </div>
                <div className='mainField'>
                    <input 
                        id='Book Name'
                        readOnly = {allowClick}
                        required
                        placeholder='Enter Book Name'
                        value = {bookName}
                        onChange = {(e)=>(setBookName(e.target.value))}
                    />
                </div>
                <div className="mainField">
                    <input 
                        id='Book Edition'
                        readOnly = {allowClick}
                        type='number'
                        min={1}
                        required
                        placeholder='Enter Book Edition'
                        value = {edition}
                        onChange = {(e)=>(setEdition(e.target.value))}
                    />
                </div>
                <div className="mainField">
                    <input 
                        id='Author Name'
                        readOnly = {allowClick}
                        required
                        placeholder='Enter Author Name'
                        value = {authorName}
                        onChange = {(e)=>(setAuthorName(e.target.value))}
                    />
                </div>
                <div className="mainField">
                <label htmlFor = 'Publish-Date' className='fields'>Publish Date:</label>
                    <input
                        id='Publish-Date'
                        readOnly = {allowClick}
                        type='date' 
                        required
                        value = {publishDate}
                        onChange = {(e)=>(setPublishDate(e.target.value))}
                    />
                </div>
                {isBorrowed &&
                <div className="mainField">
                    <label htmlFor = 'Issue-Date' className='fields'>Issue Date:</label>
                        <input
                            id='Issue-Date'
                            readOnly = {allowClick}
                            type='date' 
                            required
                            value = {issueDate}
                            onChange = {(e)=>(setIssueDate(e.target.value))}
                        />
                </div>
                }
                {isBorrowed && 
                <div className="mainField">
                    <label htmlFor = 'Return-Date' className='fields'>Return Date:</label>
                        <input
                            id='Return-Date'
                            readOnly = {allowClick}
                            type='date' 
                            required
                            value = {returnDate}
                            onChange = {(e)=>(setReturnDate(e.target.value))}
                        />
                </div>
                }
                <div className="mainField" id='submitButton'>
                <p 
                    className= {allowClick ? "submitButtonOff":"submitButton"}
                    disabled = {allowClick}
                >
                    <button type = 'submit'>{props.book?.id ? 'Update Details' : 'Add Details'}</button>
                </p>
                {!props.book?.id &&
                <button 
                    disabled = {!allowClick}
                    className={allowClick? 'assignButton' : 'assignButtonOff'}
                    onClick={(e)=>(openAssignModal(e))}
                >
                    Assign Book
                </button>}
                </div>
                <div className="footerButtons">
                    <button 
                    onClick={(e)=>(goBack(e))}
                    className='cancelBtn'
                    >
                    Cancel
                    </button>
                    <button 
                    onClick = {(e)=>(goBack(e))}
                    disabled = {!allowClick}
                    className={allowClick ? 'okeyBtn' : 'okeyBtnOff'}
                    >
                    Ok
                    </button>
                </div>
            </form>
            </div>
        </div>
    )
}

export default BookModal;
