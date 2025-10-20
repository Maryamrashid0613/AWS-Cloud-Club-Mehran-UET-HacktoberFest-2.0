import React from 'react'


export default function ExportPage(){
return (
<div className="min-h-screen bg-gray-50 p-6">
<div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
<h2 className="text-xl font-semibold">Export</h2>
<p className="mt-2 text-sm text-gray-600">Export your data as CSV or PDF for backup or tax reporting.</p>


<div className="mt-4 flex gap-3">
<button className="px-3 py-2 rounded bg-indigo-600 text-white">Export CSV</button>
<button className="px-3 py-2 rounded border">Export PDF</button>
</div>
</div>
</div>
)
}