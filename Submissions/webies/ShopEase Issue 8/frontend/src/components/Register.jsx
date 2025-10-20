import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../Utils.js';
import { ToastContainer } from 'react-toastify';

const Register = () => {


  const [singupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSignupInfo(prevSignupInfo => ({
      ...prevSignupInfo,
      [name]: value
    }))
  }

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, password } = singupInfo
    if (!name || !email || !password) {
      handleError('please Enter credentials first')
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(singupInfo)
      })
      const result = await res.json()
      const {success,message,error}=result
      if(success){
        handleSuccess(message)
        setTimeout(()=>{
          navigate('/login')
        },1000)
      }else if(error){
        const details= error?.details[0].message
        handleError(details)
      }else if(!success){
        handleError(message)
      }
      console.log(result)
    } catch (err) { 
      handleError(err)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-purple-600 text-center mb-6">SignUp</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            onChange={handleChange}
            name='name'
            placeholder="Name"
            value={singupInfo.name}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="email"
            onChange={handleChange}
            name='email'
            placeholder="Email"
            value={singupInfo.email}
            autoComplete="username"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            onChange={handleChange}
            name='password'
            value={singupInfo.password}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded-md hover:bg-purple-700 transition"
          >
            Signup
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Register;
