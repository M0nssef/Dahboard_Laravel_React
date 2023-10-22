import { useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axiosClient from "../axios-client.js";
import { useStateContext } from '../contexts/ContextProvider';
const Signup = () => {

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordeRef = useRef();
  const passwordConfirmationRef = useRef();


  const [errors , setErrors] = useState(null)
  const {SetUser ,setToken} = useStateContext()

  const onSubmit = (ev) => {
    ev.preventDefault()
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordeRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    }
    axiosClient.post('/signup', payload)
    .then(({data}) => {
      SetUser(data.user);
      setToken(data.token);
    })
    .catch(err => {
      const response = err.response;
      if (response && response.status === 422) {
        setErrors(response.data.errors)
      }
    })
  }


  return (
    <div className='login-signup-form animated fadeInDown'>
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className='title'>
            Sign up for Free
          </h1>
          {
            errors ? Object.keys(errors).map((key)=>(
              <p className='alert' key={key} style={{color:'red'}}>{errors[key][0]}</p>
              )) : null
          }
          <input ref={nameRef} type="text" placeholder='Full name' />
          <input ref={emailRef} type="email" placeholder='Enter Your Email' />
          <input ref={passwordeRef} type="password" placeholder='Enter Your Password' />
          <input ref={passwordConfirmationRef} type="password" placeholder='Password Confirmation' />

          <button className='btn btn-block'>
            SignUp
          </button>

          <p className='message'>
            Already Registered ?  <Link to='/login' > Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup