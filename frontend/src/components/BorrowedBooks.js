import { Modal,Table } from 'antd'
import React from 'react'
import moment from 'moment';
import useDataContext from '../hooks/useDataContext';
import useViewBookContext from '../hooks/useViewBookContext';


const BorrowedBooks = () => {

  const {students} = useDataContext();
  const {openBorrowedModal} = useViewBookContext();

  const data = students?.find((student)=>{
              return student.uuid === localStorage.getItem('user')
              })?.books.filter((item)=>{
                return item.isBorrowed === true
                })?.map((item)=>({key:item.id,...item}));

  const column = [
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
      title:'Due Date',
      key: 'key',
      align: 'center',
      render: payload=>{
        return  <div className='dueDate'>{moment(payload.returnDate).format('MMMM Do, YYYY')}</div>
        }
    }
  ];

  return (
    <div className='borrowedBooks'>
        <Modal
            title={'BorrowedBooks'}
            centered
            open = {true}
            footer = {null}
            width= {900}
            height = {550}
            onCancel={openBorrowedModal}
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

export default BorrowedBooks
