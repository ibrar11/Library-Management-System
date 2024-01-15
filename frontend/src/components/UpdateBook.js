import React from 'react'
import BookModal from './BookModal';
import useDataContext from '../hooks/useDataContext';
import useViewBookContext from '../hooks/useViewBookContext';

const UpdateBook = () => {

  const {books} = useDataContext();
  const {id} = useViewBookContext();

   const bookToUpdate = books.find((book)=>(book.id === id ));

  return (
    <div className='updatePanel'>
            {bookToUpdate && <BookModal
              book = {bookToUpdate}
            /> }
    </div>
  )
}

export default UpdateBook
