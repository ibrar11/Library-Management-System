import moment from 'moment';
import BookModal from './BookModal'
import { Button } from 'antd'
import { useEffect, useState } from 'react';
import UpdateBook from './UpdateBook';
import AssignModal from './AssignModal';
import StudentDetails from './StudentDetails';
import { useNavigate } from 'react-router';
import useAuthContext from '../hooks/useAuthContext';
import BorrowedBooks from './BorrowedBooks';
import RequestModal from './RequestModal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ViewRequests from './ViewRequests';

const ViewBooks = (props) => {
  
  const [id , setId] = useState(0);
  const [rollNumber , setRollNumber] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [assignModal , setAssignModal] = useState(false);
  const [assignedModal , setAssignedModal] = useState(false);
  const [confirmModal , setConfirmModal] = useState(false);
  const [borrowedModal, setBorrowedModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [viewRequests , setViewRequests] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const {auth} = useAuthContext();
  const navigate = useNavigate();
  
  useEffect(()=>{
    if(!localStorage.getItem('user')) {
      navigate('/unauthorized');
    }
    // eslint-disable-next-line
  },[])

  const openModal = (e) => {
    e.preventDefault();
    props.setIsModalOpen(true);
  }

  const openConfirmModal = (e,bookId) => {
    e.preventDefault();
    setId(bookId)
    setConfirmModal(true);
  }

  const closeConfirmModal = (e,bookId) => {
    e.preventDefault();
    if(bookId){
      props.handleDelete(e,bookId)
    }
    setId(0)
    setConfirmModal(false);
  }

  const ooenEditModal = (e,bookId) => {
    e.preventDefault();
    setId(bookId);
    setEditModal(true);
  }

  const openAssignModal = (e,bookId) => {
    e.preventDefault();
    setId(bookId);
    setAssignModal(true);
  }

  const openAssignedModal = (e,studentUuid) => {
    e.preventDefault();
    setId(studentUuid);
    setRollNumber(props.students.find((std)=>(std.uuid === studentUuid))?.rollNumber);
    setAssignedModal(true);
  }

  const commonModalCloser = (e) => {
    e.preventDefault();
    props.setIsModalOpen(false);
    setConfirmModal(false);
    setAssignedModal(false);
    setAssignModal(false);
    setEditModal(false);
    setRollNumber('')
  }

  const openBorrowedModal = () => {
    setBorrowedModal(!borrowedModal);
  }

  const handleRequestModal = async (bookId) => {
    if(!requestModal) {
      const id = props.books?.find((book)=>(book.id === bookId))?.student?.uuid;
      const result = await axiosPrivate(`students/${id}`);
      localStorage.setItem('uuid',result.data.uuid)
      setId(bookId);
    }
    setRequestModal(!requestModal);
  }

  const handleViewRequests = async () => {
    setViewRequests(!viewRequests);
  }


  return (
    <div className='booksPanel'>
      {(props.isModalOpen || editModal || assignModal || assignedModal) &&
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
      <div className={props.isModalOpen? 'popupActive' : 'popup'}>
          {props.isModalOpen && <BookModal 
            handleSubmit = {props.handleSubmit} 
            setIsModalOpen = {props.setIsModalOpen}
            isModalOpen = {props.isModalOpen}
            setAssignModal = {setAssignModal}
            setId = {setId}
            bookId = {props.bookId}
          />}
      </div>
      {borrowedModal && 
        <BorrowedBooks
          students = {props.students}
          openBorrowedModal = {openBorrowedModal} 
        />
      }
      <div className={editModal ? 'popupActive' : 'popup'}>
        {editModal && 
          <UpdateBook 
            bookId = {id}
            books = {props.books}
            setEditModal = {setEditModal}
            setBookId = {setId}
            handleSubmit = {props.handleSubmit}
          />
        }
      </div>
      <div className={assignModal ? 'popupActive' : 'popup'}>
        {assignModal && <AssignModal
          bookId = {id}
          books = {props.books}
          handleAssign = {props.handleAssign}
          setAssignModal = {setAssignModal}
          students = {props.students}
          role = {props.students?.find((user)=>(user.uuid === localStorage.getItem('user')))?.role}
          student = {props.students?.find((user)=>(user.uuid === localStorage.getItem('user')))}
        />}
      </div>
      <div className={assignedModal ? 'popupActive' : 'popup'}>
        {rollNumber && <StudentDetails
          studentId = {id}
          students = {props.students}
          books = {props.books.filter((book)=>(book.student !== null && (book.student.rollNumber === rollNumber)))}
          setAssignedModal = {setAssignedModal}
          setRollNumber = {setRollNumber}
        />}
      </div>
      {requestModal && 
        <RequestModal
          bookId = {id}
          books = {props.books}
          student = {props.students?.filter((student)=>(student.uuid === localStorage.getItem('uuid')))}
          handleRequestModal = {handleRequestModal}
          handleAssign = {props.handleAssign}
          handleReturn = {props.handleReturn}
        />
      }
      {viewRequests &&
        <ViewRequests
          books = {props.books}
          students = {props.students}
          handleViewRequests = {handleViewRequests}
          handleAssign = {props.handleAssign}
          handleReturn = {props.handleReturn}
        />
      }
      <div className='booksView'>
          <div className="panelHeading">
            <h2>List of Books</h2>
            <div className={auth?.user?.role === 4757 ? 'panel-Heading-Buttons2' : 'panel-Heading-Buttons'}>
              {(!props.isModalOpen && !editModal && !assignModal && !assignedModal) && 
                <Button 
                  type='primary' 
                  onClick = {(e)=>(auth?.user?.role === 4757 ? openBorrowedModal() : openModal(e))}
                >
                  {auth?.user?.role === 4757 ? 'Borrowed Books' : 'Add Book'}
                </Button>
              }
              {(auth?.user?.role === 4636 && !props.isModalOpen && !editModal && !assignModal && !assignedModal) && 
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
              {props.books.map((book) => {
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
                          {(auth?.user?.role === 4636 && book.rollNumber && !book.isBorrowed) ?
                            <>
                              <p id='viewRequest'>
                                <button 
                                  className='viewReqBtn' 
                                  onClick = {()=>(book.student ? handleRequestModal(book.id) : props.handleReturn(book.id))}
                                >
                                  {book.student ? "View Request" : 'Dehold'}
                                </button>
                              </p>
                            </>
                          : (auth?.user?.role === 4636) ?
                            <>
                              <p id='edit'>
                                <button 
                                  onClick={(e)=>ooenEditModal(e,book.id)}
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
                                    onClick={(e)=>props.handleReturn(book?.id)}
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
                          {auth?.user?.role === 4636 &&
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
