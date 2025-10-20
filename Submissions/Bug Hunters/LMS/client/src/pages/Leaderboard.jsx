import React from 'react'


export default function Leaderboard(){
const friends = [ { name: 'Aisha', points:210 }, { name:'Bilal', points:180 }, { name:'You', points:120 }]
return (
<div className="min-h-screen bg-gray-50 p-6">
<div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
<h2 className="text-xl font-semibold">Leaderboard</h2>
<ol className="mt-4 space-y-2">
{friends.sort((a,b)=>b.points-a.points).map((f,i)=> (
<li key={f.name} className="flex justify-between">
<div>{i+1}. {f.name}</div>
<div>{f.points} pts</div>
</li>
))}
</ol>
</div>
</div>
)
}