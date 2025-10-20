import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TopBox = ({ label, icon: Icon, value, color }) => {
  const data = {
    labels: [label, 'Remaining'],
    datasets: [
      {
        data: [value, 100 - value], 
        backgroundColor: [
          color,
          'rgba(230, 230, 230, 0.4)', 
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '80%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="bg-white shadow-md font-medium rounded-lg p-4 w-full flex flex-col 
       items-center justify-center space-y-2">
      <div className="text-2xl" style={{ color }}>
        {Icon && <Icon />}
      </div>
      <span className="text-gray-500 text-lg">{label}</span>
      <div className="w-14 h-14">
        <Doughnut data={data} options={options} />
      </div>
      <span className="text-lg font-semibold">
        {(value ?? 0).toFixed(2)}
      </span>

    </div>
  );
};

export default TopBox;
