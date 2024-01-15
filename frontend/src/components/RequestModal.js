import { Modal, Table } from 'antd'
import moment from 'moment';
import useDataContext from '../hooks/useDataContext';
import useViewBookContext from '../hooks/useViewBookContext';

const RequestModal = (props) => {

    const {handleAssign, handleReturn} = useDataContext();
    const {id,handleRequestModal} = useViewBookContext();

    const declineRequest = () => {
        handleReturn(id);
        localStorage.removeItem('uuid');
        handleRequestModal();
    }

    const handleAccept = () => {
        const student = props.student[0];
        student.bookId = id;
        student.returnDate = bookData[0].returnDate;
        handleAssign(student);
        localStorage.removeItem('uuid');
        handleRequestModal();
    }

    const studentData = props.student?.map((student)=>({
        key:student.uuid,
        ...student
    }));

    const bookData = props.student[0]?.books?.filter((book)=>{
        return (book.id === id)
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
                    handleRequestModal();
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
