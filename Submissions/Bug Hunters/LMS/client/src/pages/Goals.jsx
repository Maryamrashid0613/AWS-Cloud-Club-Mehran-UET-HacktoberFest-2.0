import React from 'react'


export default function Goals(){
return (
<div className="min-h-screen bg-gray-50 p-6">
<div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
<h2 className="text-xl font-semibold">Savings Goals</h2>
<p className="mt-2 text-sm text-gray-600">Track and top up your goals.</p>


<div className="mt-4 grid gap-3">
<div className="p-3 border rounded">Emergency Fund — $250 / $1000</div>
<div className="p-3 border rounded">Holiday — $120 / $600</div>
</div>
</div>
</div>
)
}