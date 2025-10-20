// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || password.length < 1) {
      setError('Please enter email and password.')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/api/auth/login', { email, password })
      // expected server response: { user: {...}, token: '...' }
      const { user, token } = res.data

      // store token and user in localStorage (consider HttpOnly cookies for production)
      localStorage.setItem('pfd_token', token)
      localStorage.setItem('pfd_user', JSON.stringify(user))

      // navigate to dashboard
      nav('/')
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold">Sign in</h3>

        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

        <label className="block mt-4 text-sm">
          Email
          <input
            type="email"
            className="w-full mt-1 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block mt-3 text-sm">
          Password
          <input
            type="password"
            className="w-full mt-1 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={1}
          />
        </label>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <Link to="/register" className="text-sm text-indigo-600">
            Create account
          </Link>
        </div>
      </form>
    </div>
  )
}
