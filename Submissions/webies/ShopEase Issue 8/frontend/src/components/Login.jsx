import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../Utils.js';
import { ToastContainer } from 'react-toastify';

const Login = () => {


  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log(name, value)
    setLoginInfo(prevLoginInfo => ({
      ...prevLoginInfo,
      [name]: value
    }))
  }

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = loginInfo
    if (!email || !password) {
     return handleError('please Enter credentials first')
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      })
      const result = await res.json()
      const { success, message, error, jwtToken, name, user } = result
      if (success) {

        localStorage.setItem('token', jwtToken)
        localStorage.setItem('loggedIn', user.name)
        handleSuccess('login successful')
        setTimeout(() => {
              window.location.href='/login'
        }, 1200)  

         } else if (error) {
        const details = error?.details?.[0]?.message || error.message || 'Login failed'
        handleError(details)

      } else if (!success) {
        handleError(message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      handleError('Network error occurred')
    }
     
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-purple-600 text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            onChange={handleChange}
            name='email'
            placeholder="Email"
            value={loginInfo.email}
            autoComplete="username"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            onChange={handleChange}
            name='password'
            value={loginInfo.password}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded-md hover:bg-purple-700 transition"
          >
            Sign in
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Dont have an account?{" "}
          <Link to="/register" className="text-purple-600 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Login;
