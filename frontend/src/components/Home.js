import { Button } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthContext from '../hooks/useAuthContext'
import AuthModel from './AuthModel'
import useDataContext from '../hooks/useDataContext'

const Home = () => {

  const [authModel, setAuthModel] = useState('');

  const {setIsModalOpen} = useDataContext()
  const {auth,role} = useAuthContext();
  const navigate = useNavigate();

  const openModal = (e) => {
    e.preventDefault();
    if(auth?.user?.role === role.user) {
      setIsModalOpen(true);
    }
    navigate('/books');
  }

  const viewBooks = (e) => {
    e.preventDefault();
    navigate('/books')
  }

  const handleAuthModel = (authType) => {
    if(authType){
      setAuthModel(authType);
    }else {
      setAuthModel('');
    }
  }

  return (
    <div className='Home'>
      <div className = "home-text">
        <div className = "home-image">
            <img src = {require ('../asserts/library.jpeg')} alt = "Library" />
        </div>
        <div className='text-on-image'>
            <h3> Welcome to Library Management System </h3>
            {auth && <p> Do you want to add details? </p>}
            <div className='homeButtons'>
                <Button 
                  type='primary' 
                  id='addButton'
                  onClick = {(e)=>(auth ? openModal(e) : handleAuthModel('Login'))}
                  >
                    {auth?.user?.role === role.user ? 'Book Gallery' : auth?.user?.role === role.admin ? 'Add Book' : 'Login'}
                </Button>
                <Button
                  id={auth?.user?.role === role.user ? 'removeAssign' : 'assignButton'} 
                  onClick = {(e)=>(auth ? viewBooks(e) : handleAuthModel('SignUp'))}
                  >
                    {auth ? 'Assign Book' : 'Sign Up'}
                </Button>
            </div>   
        </div>
      </div>
      {authModel && 
        <div className='bluryBg' onClick={()=>(handleAuthModel())}></div>
      }
      {authModel &&
        <AuthModel
          authModel = {authModel}
          handleAuthModel = {handleAuthModel}
        />
      }
    </div>
  )
}

export default Home
