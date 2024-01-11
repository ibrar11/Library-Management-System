import React from 'react'
import BookModal from './BookModal';

const UpdateBook = (props) => {

   const bookToUpdate = props.books.find((book)=>(book.id === props.bookId ));

  return (
    <div className='updatePanel'>
            {bookToUpdate && <BookModal
              book = {bookToUpdate}
              handleSubmit = {props.handleSubmit}
              setEditModal = {props.setEditModal}
              setBookId = {props.setBookId}
            /> }
    </div>
  )
}

export default UpdateBook
