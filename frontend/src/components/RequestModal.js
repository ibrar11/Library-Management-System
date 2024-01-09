import { Modal, Table } from 'antd'
import moment from 'moment';

const RequestModal = (props) => {

    const declineRequest = () => {
        props.handleReturn(props.bookId);
        localStorage.removeItem('uuid');
        props.handleRequestModal();
    }

    const handleAccept = () => {
        const student = props.student[0];
        student.bookId = props.bookId;
        student.returnDate = bookData[0].returnDate;
        props.handleAssign(student);
        localStorage.removeItem('uuid');
        props.handleRequestModal();
    }

    const studentData = props.student?.map((student)=>({
        key:student.uuid,
        ...student
    }));

    const bookData = props.student[0]?.books?.filter((book)=>{
        return (book.id === props.bookId)
    }).map((book)=>({key:book.id,...book}));

    const studentColumns = [
        {
            title:'Student Name',
            key: 'key',
            align: 'center',
            dataIndex: 'studentName'
          },
          {
            title:'Roll Number',
            key: 'key',
            align: 'center',
            render: payload => {
                return payload.rollNumber.toUpperCase();
            }
          }
    ];

    const bookColumns = [
        {
            title:'Book Name',
            key: 'key',
            align: 'center',
            dataIndex: 'bookName'
          },
          {
            title:'Author Name',
            key: 'key',
            align: 'center',
            dataIndex: 'authorName'
          },
          {
            title:'Edition',
            key: 'key',
            align: 'center',
            dataIndex: 'edition'
          },
          {
            title:'Proposed Return',
            key: 'key',
            align: 'center',
            render: payload=> {
                return moment(payload.returnDate).format('MMMM Do, YYYY')
            }
          }
    ];

  return (
    <div className='requestModal'>
        <Modal
            title={'Borrow Request'}
            centered
            open = {true}
            cancelText = {'Decline'}
            cancelButtonProps={{ id: 'declineButton' }}
            okText = {'Accept'}
            width= {900}
            height = {550}
            onOk={handleAccept}
            onCancel={(e)=>{
                if(e.currentTarget.id === 'declineButton') {
                    declineRequest();
                }else {
                    localStorage.removeItem('uuid');
                    props.handleRequestModal();
                }
            }}
            destroyOnClose= {true}
        >
            <Table
                className='requestTables'
                title={()=>('Book Details')}
                dataSource= {bookData}
                columns={bookColumns}
                pagination={false}
            />
            <Table
                className='requestTables'
                title={()=>('Requested By')}
                dataSource = {studentData}
                columns={studentColumns}
                pagination={false}
            />
        </Modal>
    </div>
  )
}

export default RequestModal
