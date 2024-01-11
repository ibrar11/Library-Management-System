import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import { Route, Routes} from "react-router-dom";
import { useEffect, useState } from 'react';
import ViewBooks from './components/ViewBooks';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import Unauthorized from './components/Unauthorized';
import useAuthContext from './hooks/useAuthContext';
import moment from 'moment';

function App() {

  const [books , setBooks] = useState([]);
  const [students , setStudents] = useState([]);
  const [isModalOpen , setIsModalOpen] = useState(false);
  const [bookId , setBookId] = useState(0);
  const {auth} = useAuthContext();

  const axiosPrivate = useAxiosPrivate();

  useEffect(()=>{
    const fetchData = async () => {
      try{
        if(localStorage.getItem('user')) {
          let response = await axiosPrivate.get(`books`);
          if(Array.isArray(response.data)) {
            setBooks(response.data);
          }else {
            setBooks([]);
          }
          response = await axiosPrivate.get(`students`);
          if(Array.isArray(response.data)) {
            setStudents(response.data);
          }else {
            setStudents([]);
          }
        }
      }catch(err){
        console.log(err.message);
      }
    }
    fetchData();
    // eslint-disable-next-line
  },[localStorage.getItem('user')])

  const handleSubmit = async (book) => {
    try{
      const {bookName,edition,authorName,publishDate,issueDate,returnDate,isBorrowed,id} = book;
      if (!id) {
        const bookToAdd = {
          bookName,
          edition,
          authorName,
          publishDate,
        };
        const response = await axiosPrivate.post('books',bookToAdd);
        setBookId(response.data.book.id);
        setBooks([...books,response.data.book]);
        return true;  
      }else if(id){
        const bookToUpdate = {
          bookName,
          edition,
          authorName,
          publishDate,
          isBorrowed,
          issueDate,
          returnDate
        }
        await axiosPrivate.put(`books/${id}`,bookToUpdate);
        const response = await axiosPrivate.get(`books`);
        setBooks(response.data);
        return true;
      }else {
       return false;
      }
    }catch(err){
    console.log(err.message);
    }
  };

  const handleDelete = async (e,id) => {
     e.preventDefault();
     try{
      await axiosPrivate.delete(`books/${id}`);
      const remainingBooks = books.filter((book)=>(book.id!==id));
      setBooks(remainingBooks);     
     }catch(err){
      console.log(err.message);
     }
  };

  const handleAssign = async (studentDetails) => {
    try{
      const assigningDate = moment().format('YYYY-DD-MM');
      const student = {
        bookId: studentDetails.bookId,
        rollNumber: studentDetails.rollNumber,
        returnDate: studentDetails.returnDate
      }
      if(auth?.user.role !== 4757) {
        student.assigningDate = assigningDate;
      }
      const response = await axiosPrivate.post(`students`,student);
      if(response?.data?.student) {
        setStudents([...students,response.data.student]);
      }
      const result = await axiosPrivate.get(`books`)
      setBooks(result.data);
      return true;
    }catch(err){
      if(err.response?.status === 404) {
        console.log(err);
        alert(err.response?.data?.message)
      }else {
        console.log(err);
      }
    }
  };
  const handleReturn = async (id) => {
    try{
      await axiosPrivate.put(`students/${id}`);
      const result = await axiosPrivate.get(`books`)
      setBooks(result.data);
    }catch(err) {
      console.log(err.message);
    }
  };

  return (
    <div className="App">
     <Header
        students = {students}
        setStudents = {setStudents}
        setIsModalOpen = {setIsModalOpen}
     />
     <main>
      <Routes>
          <Route path='/' element = {
            <Home 
              students = {students}
              setStudents = {setStudents}
              setIsModalOpen = {setIsModalOpen} 
            />
          } 
          />
          <Route path='/books' element = {
            <ViewBooks 
              bookId = {bookId}
              handleSubmit = {handleSubmit}
              handleDelete = {handleDelete}
              books = {books} 
              students = {students}
              isModalOpen = {isModalOpen}
              setIsModalOpen = {setIsModalOpen}
              handleAssign = {handleAssign}
              handleReturn = {handleReturn}
            />
          } 
          />
          <Route path='/unauthorized' element = {
            <Unauthorized/>
          }
          />
      </Routes>
     </main>
    
     <Footer/>
    </div>
  );
}

export default App;
