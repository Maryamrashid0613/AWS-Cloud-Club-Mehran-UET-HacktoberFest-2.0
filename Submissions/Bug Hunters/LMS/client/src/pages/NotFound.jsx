import React from 'react'
import { Link } from 'react-router-dom'


export default function NotFound(){
return (
<div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
<div className="text-center">
<h1 className="text-4xl font-bold">404</h1>
<p className="mt-2 text-gray-600">Page not found</p>
<Link to="/" className="mt-4 inline-block px-4 py-2 rounded bg-indigo-600 text-white">Return home</Link>
</div>
</div>
)
}