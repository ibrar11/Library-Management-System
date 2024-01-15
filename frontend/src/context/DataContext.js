import { createContext, useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const DataContext = createContext({});

export const  DataContextProvider = ({children}) => {

    const [students , setStudents] = useState([]);
    const [books , setBooks] = useState([]);
    const [isModalOpen , setIsModalOpen] = useState(false);
    const [bookId , setBookId] = useState(0);

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
                console.log(err);
            }
        };

        fetchData();
      // eslint-disable-next-line
    },[localStorage.getItem('user')]);
    
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
        <DataContext.Provider value={{
            students,
            setStudents,
            books,
            setBooks,
            isModalOpen,
            setIsModalOpen,
            bookId,
            handleReturn,
            handleDelete,
            setBookId,
        }}
        >
            {children}
        </DataContext.Provider>
    )

};

export default DataContext;