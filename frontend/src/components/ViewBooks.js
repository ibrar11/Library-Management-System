import moment from 'moment';
import BookModal from './BookModal'
import { Button } from 'antd'
import UpdateBook from './UpdateBook';
import AssignModal from './AssignModal';
import StudentDetails from './StudentDetails';
import useAuthContext from '../hooks/useAuthContext';
import BorrowedBooks from './BorrowedBooks';
import RequestModal from './RequestModal';
import ViewRequests from './ViewRequests';
import useDataContext from '../hooks/useDataContext';
import useViewBookContext from '../hooks/useViewBookContext';

const ViewBooks = () => {
  
  const {auth,role} = useAuthContext();
  const {students, books, isModalOpen , handleReturn} = useDataContext();

  const {id, rollNumber ,editModal,assignModal,assignedModal,confirmModal,
    commonModalCloser, closeConfirmModal,borrowedModal, openBorrowedModal,
    requestModal, handleRequestModal, viewRequests, handleViewRequests,
    openModal, openEditModal, openAssignModal, openAssignedModal, 
    openConfirmModal} = useViewBookContext();

  return (
    <div className='booksPanel'>
    {(isModalOpen || editModal || assignModal || assignedModal) &&
      <div className='blurDisplay' onClick={(e)=>(commonModalCloser(e))}></div>
    }
    <div className={confirmModal ? 'popupActive' : 'popup'}>
        <div className='confirm-Modal'>
          <p className='confirm-Msg'>Do you want to delete it permanently?</p>
          <div className='confirm-Btn' >
            <button onClick={(e)=>(closeConfirmModal(e))}>
              No
            </button>
            <button id='yes-btn' onClick={(e=>(closeConfirmModal(e,id)))}>
              Yes
            </button>
          </div>
        </div>
    </div>
    <div className={isModalOpen? 'popupActive' : 'popup'}>
      {isModalOpen && 
        <BookModal />
      }
    </div>
      {borrowedModal && 
        <BorrowedBooks/>
      }
    <div className={editModal ? 'popupActive' : 'popup'}>
      {editModal && 
        <UpdateBook/>
      }
    </div>
    <div className={assignModal ? 'popupActive' : 'popup'}>
      {assignModal && 
        <AssignModal
          role = {students?.find((user)=>(user.uuid === localStorage.getItem('user')))?.role}
          student = {students?.find((user)=>(user.uuid === localStorage.getItem('user')))}
        />
      }
    </div>
    <div className={assignedModal ? 'popupActive' : 'popup'}>
      {rollNumber && 
        <StudentDetails
          books = {books.filter((book)=>{
                    return book.student !== null && (book.student.rollNumber === rollNumber)
                  })}
        />
      }
    </div>
    {requestModal && 
      <RequestModal
        student = {students?.filter((student)=>{
                    return student.uuid === localStorage.getItem('uuid')
                  })}
      />
    }
    {viewRequests &&
      <ViewRequests/>
    }
    <div className='booksView'>
        <div className="panelHeading">
          <h2>List of Books</h2>
          <div className={auth?.user?.role === role.user ? 'panel-Heading-Buttons2' : 'panel-Heading-Buttons'}>
            {
              (
                !isModalOpen && !editModal && 
                !assignModal && !assignedModal
              ) && 
                <Button 
                  type='primary' 
                  onClick = {(e)=>(auth?.user?.role === role.user ? openBorrowedModal() : openModal(e))}
                >
                  {auth?.user?.role === role.user ? 'Borrowed Books' : 'Add Book'}
                </Button>
            }
            {
              (
                auth?.user?.role === role.admin && 
                !isModalOpen && !editModal && 
                !assignModal && !assignedModal
              ) && 
              <Button 
                classNames={'view-Request-Button'}
                onClick={handleViewRequests}
              >
                View Requests
              </Button>
            }
          </div>
        </div>
        <table className='booksTable'>
          <thead>
              <tr className='row'>
                <th>Id</th>
                <th>Book Name</th>
                <th>Edition</th>
                <th>Author Name</th>
                <th>Publish Date</th>
                <th>Status</th>
                <th id='lastHeading'>Actions</th>
              </tr>
          </thead>
          <tbody>
            {books?.map((book) => {
              return(
                <tr className='tableRow' key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.bookName}</td>
                  <td>{book.edition}</td>
                  <td>{book.authorName}</td>
                  <td>{moment(book.publishDate).format('MMMM Do, YYYY')}</td>
                  <td>
                    {
                      book.isBorrowed ? 'Borrowed' : 
                      (book.isRequested) ? 'Requested' :
                      book.rollNumber ? `Upholding For ${book.rollNumber}` : 'Available'
                    }
                  </td>
                  <td>
                    <div className='last-cell'>
                      <div className='operations'>
                        {(auth?.user?.role === role.admin && book.rollNumber && !book.isBorrowed) ?
                          <>
                            <p id='viewRequest'>
                              <button 
                                className='viewReqBtn' 
                                onClick = {()=>(book.student ? handleRequestModal(book.id) : handleReturn(book.id))}
                              >
                                {book.student ? "View Request" : 'Dehold'}
                              </button>
                            </p>
                          </>
                        : (auth?.user?.role === role.admin) ?
                          <>
                            <p id='edit'>
                              <button 
                                onClick={(e)=>openEditModal(e,book.id)}
                                className='operationBtn'
                              >
                                Edit
                              </button>
                            </p>
                            {!book.isBorrowed ? 
                              <p id='borrow'>
                                <button
                                  onClick={(e)=>openAssignModal(e,book.id)}
                                  className='operationBtn'
                                >
                                  Assign Book
                                </button>
                              </p> :
                              <p id='borrowed'>
                                <button 
                                  className='operationBtn'
                                  onClick={(e)=>openAssignedModal(e,book.student?.uuid)}
                                >
                                  Assigned
                                </button>
                                <button 
                                  className='operationBtn'
                                  onClick={(e)=>handleReturn(book?.id)}
                                >
                                  Return
                                </button>
                              </p>
                            }
                          </>
                        :
                          <>
                            {(!book.isBorrowed && !book.isRequested && !book.rollNumber) ?
                              <button 
                                className='operationBtn' 
                                id='requestButton'
                                onClick={(e)=>openAssignModal(e,book.id)}
                              >
                                Request Book
                              </button>
                              :
                              <p id='returnMessage'>
                                {(book.isRequested && !book.isBorrowed) ? 'Wait for Confirmation' : 'Wait for return'}
                              </p>
                            }
                          </>
                        }
                        {auth?.user?.role === role.admin &&
                          <div className='main-table-delete-button'>
                            <button 
                              className='operationBtn' 
                              onClick = {(e)=>(openConfirmModal(e,book.id))}
                            >
                              Delete
                            </button>
                          </div>
                        }
                      </div>
                    </div>
                  </td>
                </tr>
              )
            }
            )
            }
          </tbody>
        </table>
    </div>
    </div>
  )
}

export default ViewBooks;
