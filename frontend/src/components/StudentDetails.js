import React from 'react'
import moment from 'moment';
import useDataContext from '../hooks/useDataContext';
import useViewBookContext from '../hooks/useViewBookContext';

const StudentDetails = (props) => {

    const {students} = useDataContext();
    const {id,setAssignedModal,setRollNumber} = useViewBookContext();

    const student = students.find((student)=>(student.uuid === id));

    const goBack = (e)=> {
        e.preventDefault();
        setRollNumber('');
        setAssignedModal(false);
    }

    const getIssueDate = (bookId) => {
        try{
            const std = props.books.find((book)=>(book.id === bookId));
            return std.assigningDate;
        }catch(err){
            console.log(err.message);
        }
    }

    const getReturnDate = (bookId) => {
        try{
            const std = props.books.find((book)=>(book.id === bookId));
            return std.returnDate;
        }catch(err){
            console.log(err.message);
        }
    }

  return (
    <div className='studentPanel'>
       <div className='subPanel'>
        <div className='panelContent'>
            <div className="panelHeadings">
                <h2>Student Info:</h2>
                <div className="close-btn2">
                    <button
                        onClick = {(e)=>(goBack(e))}
                    >
                        &times;
                    </button>
                </div>
            </div>
            <div className='detailSection'>
                {student ? 
                    <div className="studentDetails">
                        <div><p id='firstField'>Name:</p>{student.studentName}</div>
                        <div><p>Roll No: </p>{student.rollNumber}</div>
                    </div> : 
                    <div className="studentDetails">
                        <p>Student Not Found!</p>
                    </div>
                }
                
            </div>
            <div className="panelHeadings">
                <h2>Books Assigned:</h2>
            </div>
            <div className='assignedbooksView'>
                <table className='assignedbooksTable'>
                    <thead className='assignedThead'>
                        <tr className='assignedTableRow'>
                        <th>Book Name</th>
                        <th>Edition</th>
                        <th>Author Name</th>
                        <th>Issue Date</th>
                        <th>Return Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {props.books.map((book) => {
                        return(
                        <tr className='assignedTableRow' key={book.id}>
                            <td>{book.bookName}</td>
                            <td>{book.edition}</td>
                            <td>{book.authorName}</td>
                            <td>{moment(getIssueDate(book.id)).format('MMMM Do, YYYY')}</td>
                            <td>{moment(getReturnDate(book.id)).format('MMMM Do, YYYY')}</td>
                        </tr>
                        )
                    }
                    )
                    }
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    </div>
  )
}

export default StudentDetails
