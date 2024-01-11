import { Modal,Table } from 'antd'
import React from 'react'
import moment from 'moment';


const ViewRequests = (props) => {

    const data = props.books?.filter((book)=>{
        return (book.isRequested && !book.isBorrowed);
    }).map((book)=>({key:book.id, ...book}));

    const students = props.students;

    const handleAccept = (bookId) => {
        const book = data.find((item)=>(item.id === bookId));
        book.student.bookId = bookId;
        book.student.returnDate = book.returnDate
        props.handleAssign(book.student);
        props.handleViewRequests();
    }

    const declineRequest = (bookId) => {
        props.handleReturn(bookId);
        props.handleViewRequests();
    }

    const column = [
        {
            title: 'Student',
            key: 'key',
            align: 'center',
            render: payload => {
                return students?.find((student)=>{
                    return student.uuid === payload.student.uuid
                }).studentName;
            }
        },
        {
            title: 'Student',
            key: 'key',
            align: 'center',
            render: payload => {
                return students?.find((student)=>{
                    return student.uuid === payload.student.uuid
                }).rollNumber.toUpperCase();
            }
        },
        {
            title: 'Book',
            key: 'key',
            align: 'center',
            dataIndex: 'bookName'
        },
        {
            title: 'Author',
            key: 'key',
            align: 'center',
            dataIndex: 'authorName'
        },
        {
            title: 'Edition',
            key: 'key',
            align: 'center',
            dataIndex: 'edition'
        },
        {
            title: 'Proposed Return',
            key: 'key',
            align: 'center',
            render: payload=> {
                return moment(payload.returnDate).format('MMMM Do, YYYY')
            }
        },
        {
            title: 'Actions',
            key: 'key',
            align: 'left',
            render: payload => {
                return (
                    <div className='view-Request-Actions'>
                        <button onClick={()=>handleAccept(payload.id)}>
                            Accept
                        </button>
                        <button onClick={()=>declineRequest(payload.id)}>
                            Decline
                        </button>
                    </div>
                )
            }
        }
    ];

  return (
    <div className='view-Book-Requests'>
       <Modal
            title={'Book Requests'}
            centered
            open = {true}
            footer = {null}
            width= {1100}
            height = {650}
            onCancel={props.handleViewRequests}
            destroyOnClose= {true}
        >
          <Table
            dataSource={data}
            columns = {column}
        />
        </Modal>
    </div>
  )
}

export default ViewRequests
