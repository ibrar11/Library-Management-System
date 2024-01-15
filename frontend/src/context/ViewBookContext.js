import { createContext, useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router";
import useDataContext from "../hooks/useDataContext";

const ViewBookContext = createContext({});

export const ViewBookProvider = ({children}) => {

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
    const {students,books, setIsModalOpen, handleDelete} = useDataContext();
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(!localStorage.getItem('user')) {
        navigate('/unauthorized');
        }
      // eslint-disable-next-line
    },[])

    const openModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    }

    const openConfirmModal = (e,bookId) => {
        e.preventDefault();
        setId(bookId)
        setConfirmModal(true);
    }

    const closeConfirmModal = (e,bookId) => {
        e.preventDefault();
        if(bookId){
            handleDelete(e,bookId)
        }
        setId(0)
        setConfirmModal(false);
    }

    const openEditModal = (e,bookId) => {
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
        setRollNumber(students.find((std)=>(std.uuid === studentUuid))?.rollNumber);
        setAssignedModal(true);
    }

    const commonModalCloser = (e) => {
        e.preventDefault();
        setIsModalOpen(false);
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
            const id = books?.find((book)=>(book.id === bookId))?.student?.uuid;
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
        <ViewBookContext.Provider value={{
            id, setId, rollNumber, editModal,
            assignModal, assignedModal, confirmModal,
            commonModalCloser, closeConfirmModal, setAssignModal,
            borrowedModal, openBorrowedModal, setEditModal, setAssignedModal,
            setRollNumber, requestModal, handleRequestModal,
            viewRequests, handleViewRequests, openModal, openEditModal,
            openAssignModal, openAssignedModal, openConfirmModal
        }}
        >
            {children}
        </ViewBookContext.Provider>
    )
};

export default ViewBookContext;