import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { RxHamburgerMenu } from "react-icons/rx";
import AuthModel from './AuthModel';


const Header = (props) => {

  const [dropDown, setDropDown] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const {auth,setAuth} = useAuthContext();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const getUserName =  () => {
    const uuid = localStorage.getItem('user');
    const userName = props.students?.find((user)=>(user.uuid === uuid))?.studentName;
    return userName;
  }

  const closeModal = (e) => {
    e.preventDefault();
    props.setIsModalOpen(false);
    navigate('/books')
  }

  const handleDropDown = () => {
    setDropDown(!dropDown);
    if(updateModal === true) {
      handleUpdateModel();
    }
  }

  const handleUpdateModel = () => {
    setDropDown(false);
    setUpdateModal(!updateModal);
  }
  
  const handleLogout = async () => {
    try {
      await axiosPrivate.put('/auth/logout');
      props.setStudents([]);
      setAuth(null);
      setDropDown(false);
      setUpdateModal(false);
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <header className='Header'>
      <h1 className='title'>Library Management System</h1>
      {auth && 
        <nav className='navBar'>
          <h2>
              {getUserName()}
          </h2>
          <Link to={'/'} className='navLinks'>
              <button className='navButtons'>
                  <p>Home</p>
              </button>
          </Link>
          <div className='navLinks'>
              <button 
                onClick = {(e)=>(closeModal(e))}
                className='navButtons'
              >
                  <p>Books</p>
              </button>
          </div>
          <div className="menuContainer">
            <button className='menuButton' onClick={()=>(handleDropDown())}>
              <RxHamburgerMenu className='menuIcon'/>
            </button>
          </div>
          {(dropDown || updateModal) && <div className="bluryForMenu" onClick={()=>(handleDropDown())}></div>}
          <div className={dropDown ? "dropDownOpen" : "dropDownClose"}>
            <button onClick={()=>(handleUpdateModel())}>
              Change user info
            </button>
            <button onClick={()=>(handleLogout())}>
              Logout
            </button>
          </div>
        </nav>
      }
      {updateModal &&
        <AuthModel
          uuid = {localStorage.getItem('user')}
          students = {props.students}
          setStudents = {props.setStudents}
          updateModal = {updateModal}
          setUpdateModal = {setUpdateModal}
        />
      }
    </header>
  )
}

export default Header;
