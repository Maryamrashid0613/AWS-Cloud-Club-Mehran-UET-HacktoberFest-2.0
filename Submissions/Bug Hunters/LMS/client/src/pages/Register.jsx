// src/pages/Register.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(null)

    // basic client-side validation
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Please enter name, a valid email and password (min 6 chars).')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/api/auth/register', { name, email, password })
      // expected response: { user: { id, name, email, ... }, token: '...' }
      const { user, token } = res.data

      // store token and user in localStorage (consider HttpOnly cookie for production)
      localStorage.setItem('pfd_token', token)
      localStorage.setItem('pfd_user', JSON.stringify(user))

      // navigate to dashboard
      nav('/')
    } catch (err) {
      // axios error handling: prefer server message when available
      const msg = err?.response?.data?.message || err.message || 'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold">Create account</h3>

        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

        <label className="block mt-4 text-sm">
          Full name
          <input
            className="w-full mt-1 p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="block mt-3 text-sm">
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
            minLength={6}
          />
        </label>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
    </div>
  )
}
