import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'


import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Transactions from './pages/Transactions'
import Goals from './pages/Goals'
import Leaderboard from './pages/Leaderboard'
import ExportPage from './pages/Export'
import NotFound from './pages/NotFound'


// Simple auth stub (replace with real auth check)
const useAuth = () => {
// returns { user } or null
const raw = localStorage.getItem('pfd_user')
return { user: raw ? JSON.parse(raw) : null }
}


function PrivateRoute({ children }){
const { user } = useAuth()
if (!user) return <Navigate to="/login" replace />
return children
}


export default function AppRoutes(){
return (
<Router>
<Routes>
<Route path="/" element={<HomePage/>} />
<Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />

<Route path="/login" element={<Login/>} />
<Route path="/signup" element={<Register/>} />


<Route path="*" element={<NotFound/>} />
</Routes>
</Router>
)
}