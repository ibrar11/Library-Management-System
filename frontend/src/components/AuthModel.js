import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuthContext from '../hooks/useAuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDataContext from '../hooks/useDataContext';


const AuthModel = (props) => {

const {students , setStudents} = useDataContext();

const [switchModal,setSwithcModal] = useState(props.authModel === 'Login' ? false : true);
const [email, setEmail] = useState(students.length ? students.find((user)=>(user.uuid === props.uuid))?.email : '');
const [password, setPassword] = useState('');
const [name, setName] = useState(students.length ? students.find((user)=>(user.uuid === props.uuid))?.studentName : '');
const [rollNumber, setRollNumber] = useState(students.length ? 
                                    students.find((user)=>(user.uuid === props.uuid))?.rollNumber : '')

const axiosPrivate = useAxiosPrivate();
const {auth,setAuth,role} = useAuthContext();

const handleSwitch = ()=>{
    setEmail('');
    setPassword('');
    setSwithcModal(!switchModal);
}

const handleAction = async (e)=>{
    e.preventDefault();
    try{
        if(props.updateModal){
            if(name || email || password || rollNumber) {
                const userToUpdate = {
                    name,
                    email,
                    password,
                    rollNumber
                }
                let response = await axiosPrivate.put(`students/edit/${props.uuid}`,userToUpdate);
                setAuth({
                    role: response.data.user.role,
                    accessToken: response.data.accessToken
                })
                response = await axiosPrivate.get('students');
                setStudents(response.data);
                setName('');
                setEmail('');
                setPassword('');
                props.setUpdateModal(false);
            }
            return;
        }
        if(switchModal){
            if(name && rollNumber && email && password){
                const newUser = {
                    name,
                    email,
                    password,
                    rollNumber
                }
                const response = await axiosPrivate.post('register',newUser);
                setName('');
                setEmail('');
                setPassword('');
                setRollNumber('')
                const message = response.data.message;
                toast.success(message, {
                    position: toast.POSITION.TOP_CENTER,
                });
                setSwithcModal(!switchModal);
                return;
            }
        }else{
            if(email || password){
                const userToLog = {
                    email,
                    password
                }
                const response = await axiosPrivate.post('auth/login',userToLog);
                const message = response.data.message;
                toast.success(message, {
                    position: toast.POSITION.TOP_CENTER,
                });
                setAuth({
                    user: response.data.user,
                    accessToken: response.data.accessToken
                });
                localStorage.setItem("user", response.data.user.uuid);
                localStorage.setItem("auth", JSON.stringify({
                    user: response.data.user,
                    accessToken: response.data.accessToken
                }));
                const result = await axiosPrivate.get(`students`);
                setStudents(result.data);
                setEmail('');
                setPassword('');
                props.handleAuthModel();
            }
        }
    }catch(err){
            const message = err?.response?.data?.message;
            if(message) {
                toast.error(message, {
                    position: toast.POSITION.TOP_CENTER,
                });
            }else {
                toast.error('User not found!', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
            setPassword('');
            console.log(err);
    }
}

const closeUpdateModal = (e) => {
    e.preventDefault();
    props.setUpdateModal(false);
}


  return (
    <div className={props.updateModal ? 'formContainer' :'formContainer2'}>
        <form className='form' onSubmit={handleAction}>
        <h1>
            {props.updateModal ? 'Change User Info' : !switchModal ? 'Log into Account' : 'Create Account'}
        </h1>
        {switchModal &&
            <input 
            id='name'
            className='inputField'
            placeholder={'Enter your name'}
            required
            autoComplete='false'
            value={name}
            onChange={(e)=>(setName(e.target.value))}
            />
        }
        {(switchModal && (!auth || auth?.user?.role === role.user)) &&
            <input 
            id='rollNo'
            className='inputField'
            placeholder={'Enter your roll number'}
            required
            autoComplete='false'
            value={rollNumber}
            onChange={(e)=>(setRollNumber(e.target.value))}
            />
        }
        <input 
            id='email'
            className='inputField'
            type='email'
            placeholder={props.updateModal ? 'Enter new email' : 'Enter your email'}
            required = {props.updateModal ? false : true}
            autoComplete='true'
            value={email}
            onChange={(e)=>(setEmail(e.target.value))}
        />
        <input 
            id='password'
            className='inputField'
            placeholder={props.updateModal ? 'Enter new password' :'Enter Password'}
            required = {props.updateModal ? false : true}
            type='password'
            value={password}
            onChange={(e)=>(setPassword(e.target.value))}
        />
        <button
            type='submit'
            className='button'
        >
            {props.updateModal ? 'Update Details' : !switchModal ? 'Log In' : 'Sign Up'}
        </button>
        <div className='secondaryBtn'>
            {!props.updateModal && <button onClick={(e)=>handleSwitch()} type='button' className='switchBtn'>
                {!switchModal ? 'Register New User' : 'Already has an account?'}
            </button>}
            {props.updateModal &&
                <button onClick={(e)=>closeUpdateModal(e)} type='button' className='cancelBtn'>
                    Cancel
                </button>
            }
        </div>
        </form>
    </div>
  )
}

export default AuthModel;
