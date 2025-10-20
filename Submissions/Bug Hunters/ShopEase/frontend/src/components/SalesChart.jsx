import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SalesChart({ data = [] }) {
  // Aggregate by createdAt date
  const mapDaily = () => {
    const bucket = {};
    data.forEach(s => {
      const d = new Date(s.createdAt || s.date || s._id?.getTimestamp?.());
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2,'0')}`;
      bucket[key] = (bucket[key] || 0) + (s.totalAmount || 0);
    });
    const arr = Object.entries(bucket).map(([k, v]) => ({ date: k, sales: v }));
    arr.sort((a,b) => new Date(a.date) - new Date(b.date));
    return arr.slice(-7); // Last 7 days
  };

  const chartData = mapDaily();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-2xl">
          <p className="text-gray-400 font-medium text-sm">{label}</p>
          <p className="text-emerald-400 font-semibold text-lg">
            Rs. {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }}
        />
        <YAxis 
          stroke="#9CA3AF"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rs. ${value / 1000}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke="#10B981" 
          strokeWidth={3}
          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#10B981', stroke: '#059669', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}