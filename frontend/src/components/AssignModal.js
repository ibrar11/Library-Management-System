import React, { useState } from 'react'
import moment from 'moment';
import useDataContext from '../hooks/useDataContext';
import useAuthContext from '../hooks/useAuthContext';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useViewBookContext from '../hooks/useViewBookContext';

const AssignModal = (props) => {

    const [studentName , setStudentName] = useState(props.role === 4757 ? props.student.studentName :'');
    const [rollNumber , setRollNumber] = useState(props.role === 4757 ? props.student.rollNumber :'');
    const [returnDate , setReturnDate] = useState('');
    const [manualFields , setManualFields] = useState(false);

    const {students,books,setBooks,setStudents} = useDataContext();
    const {auth,role} = useAuthContext();
    const {id,setAssignModal} = useViewBookContext();

    const axiosPrivate = useAxiosPrivate();

    const bookToAssign = books.find((book)=>(book.id === id));
    

    const goBack = (e) => {
        e.preventDefault();
        setStudentName('');
        setRollNumber('');
        setReturnDate(''); 
        setManualFields(false);
        setAssignModal(false);
    }

    const showManualFields = () => {
        setRollNumber('');
        setStudentName('');
        setManualFields(true);
    }
    
    const handleAssign = async (e) => {
        e.preventDefault()
        try{
            const assigningDate = moment().format('YYYY-DD-MM');
            const condition = studentName  && rollNumber && returnDate;
            if(condition) {
                const student = {
                bookId: id,
                rollNumber: rollNumber.toLowerCase(), 
                returnDate
                }
                if(auth?.user?.role !== role.user) {
                student.assigningDate = assigningDate;
                }
                const response = await axiosPrivate.post(`students`,student);
                if(response?.data?.student) {
                setStudents([...students,response.data.student]);
                }
                const result = await axiosPrivate.get(`books`)
                setBooks(result.data);
                setStudentName('');
                setRollNumber('');
                setReturnDate(''); 
                setManualFields(false);
                setAssignModal(false);
            }
        }catch(err){
            if(err.response?.status === 404) {
            console.log(err);
            alert(err.response?.data?.message)
            }else {
            console.log(err);
            }
        }
    };

    const nameSetter = (e,value)=>{
        e.preventDefault();
        setRollNumber(value);
        const std = students.find((std)=>(std.rollNumber === value));
        if(std) {
            setStudentName(std.studentName);
            return;
        }
        setStudentName('');
    }

  return (
    <div className='assignPanel'>
        <div className='assignModal'>
            {(!bookToAssign.isBorrowed) ?
                <div className='studentDetailsModal'>
                    <form id='studentForm' onSubmit={(e)=>(handleAssign(e))}>
                    <div 
                        className="close-btn">
                        <button
                            onClick = {(e)=>(goBack(e))}
                        >
                        &times;
                        </button>
                    </div>
                    <div className="headingContent">
                            <h2>{props.role === 4757 ? 'Request Book' :'Assign Book'}</h2>
                    </div>
                    {(manualFields || props.role === 4757)  ? 
                        <div className='mainField'>
                            <input 
                                id='roll Number'
                                required
                                readOnly = {props.role === 4757 ? true :false}
                                placeholder='Roll Number'
                                value = {rollNumber}
                                onChange = {(e)=>(setRollNumber(e.target.value))}
                            />
                        </div> :
                        <div className='mainField' id='rollField'>
                            <select
                                id='rollNumber'
                                value={rollNumber}
                                onChange={(e)=>nameSetter(e,e.target.value)}
                            >
                                <option hidden>Select Roll Number</option>
                                {students.map((student)=>{
                                    return (
                                        <option key={student.uuid} value={student.rollNumber}>{student.rollNumber}</option>
                                    )
                                })}
                            </select>
                            <button type='button' id='add-btn' onClick={showManualFields}>
                                +
                            </button>
                        </div>
                    }
                    <div className='mainField'>
                            <input 
                                id='Enter Student Name'
                                required
                                readOnly = {props.role === 4757 ? true :false}
                                placeholder='Student Name'
                                value = {studentName}
                                onChange = {(e)=>(setStudentName(e.target.value))}
                            />
                    </div>
                    <div className='mainField'>
                            <input 
                                id='Book Name'
                                readOnly
                                value = {`Book Name: ${bookToAssign.bookName}`}
                            />
                    </div>
                    <div className="mainField">
                            <input 
                                id='Book Edition'
                                readOnly
                                value = {`Book Edition: ${bookToAssign.edition}`}
                            />
                    </div>
                    <div className="mainField">
                            <input 
                                id='Author Name'
                                readOnly
                                value = {`Author Name: ${bookToAssign.authorName}`}
                            />
                    </div>
                    {props.role !== 4757 && 
                        <div className="mainField">
                            <label htmlFor = 'Issue Date' className='fields'>Issue Date:</label>
                                <input
                                    id='Issue Date'
                                    readOnly
                                    required
                                    value = {moment().format('MMMM Do, YYYY')}
                                />
                        </div>
                    }
                    <div className="mainField">
                        <label htmlFor = 'Return Date' className='fields'>Return Date:</label>
                            <input
                                id='Return Date'
                                type='date' 
                                min = {moment().format("YYYY-MM-DD")}
                                required
                                placeholder='Enter Return Date'
                                value = {returnDate}
                                onChange = {(e)=>(setReturnDate(e.target.value))}
                            />
                    </div>
                    <div className="mainField" id='editSubmit'>
                        <p 
                            className="submitButton"
                        >
                            <button type = 'submit'>
                                {props.role === 4757 ? 'Submit Request' :'Submit Details'}
                            </button>
                        </p>
                    </div>
                    </form>
                </div> :
                <div className='already-msg'>
                    <div 
                        className="close-btn">
                        <button
                            onClick = {(e)=>(goBack(e))}
                        >
                        &times;
                        </button>
                    </div>
                    <div className='message'>
                        <p>Book Already Assigned</p>
                        <button onClick = {(e)=>(goBack(e))}>Go back</button>
                    </div>
                </div>
            }
        </div>
    </div>
  )
}

export default AssignModal
