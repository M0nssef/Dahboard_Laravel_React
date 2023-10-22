import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios-client';

const login = () => {

  const emailRef = useRef();
  const passwordeRef = useRef();


  const [errors , setErrors] = useState(null)
  const {SetUser ,setToken} = useStateContext()

  const onSubmit = (ev) => {
    ev.preventDefault()
    const payload = {
      email: emailRef.current.value ,
      password: passwordeRef.current.value,
    }
    setErrors(null)
    axiosClient.post('/login', payload)
    .then(({data}) => {
      SetUser(data.user);
      setToken(data.token);
    })
    .catch(err => {
      const response = err.response;
      if(response.data.errors){
        if (response && response.status === 422) {
          setErrors(response.data.errors)
        }
      }else {
        setErrors(
          {
            email : [response.data.message]
          }
        )
      }
    })
  }

  return (
    <div className='login-signup-form animated fadeInDown'>
      <div className="form">
        <form onSubmit={onSubmit}>
            <h1 className='title'>
              Login in to Your account
            </h1>

            
            {errors  && <div className='alert'> 
            { Object.keys(errors).map((key)=>(
              <p key={key}>{errors[key][0]}</p>
              )) }
            </div>}

            <input ref={emailRef} type="email" placeholder='Enter Your Email' />
            <input  ref={passwordeRef} type="password" placeholder='Enter Your Password' />

            <button className='btn btn-block'> 
              Login
            </button>

            <p className='message'>
              Not Registered ?  <Link to='/signup' > Create an account</Link>
            </p>
        </form>
      </div>
    </div>
  )
}

export default login