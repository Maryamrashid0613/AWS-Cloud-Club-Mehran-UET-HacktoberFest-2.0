import React from 'react'
import { Link } from 'react-router-dom'


export default function Dashboard(){
return (
<div className="min-h-screen bg-gray-50 p-6">
<div className="max-w-6xl mx-auto">
<header className="flex items-center justify-between mb-6">
<h1 className="text-2xl font-semibold">Dashboard</h1>
<nav className="flex gap-3">
<Link to="/transactions" className="text-sm">Transactions</Link>
<Link to="/goals" className="text-sm">Goals</Link>
<Link to="/leaderboard" className="text-sm">Leaderboard</Link>
</nav>
</header>


<section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
<div className="bg-white p-4 rounded shadow">{/* Account summary */}
<h3 className="font-medium">Account</h3>
<div className="mt-2">Balance: <strong>$1,420.50</strong></div>
</div>
<div className="bg-white p-4 rounded shadow lg:col-span-2">{/* Charts placeholder */}
<h3 className="font-medium">Spending Trend</h3>
<div className="mt-4 h-40 bg-gray-100 rounded" />
</div>
</section>


<section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="bg-white p-4 rounded shadow">Recent Transactions</div>
<div className="bg-white p-4 rounded shadow">Goals & Progress</div>
</section>
</div>
</div>
)
}