
import CashFlowChart from '../subCoponents/CashFlowChart'
import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const LegendOnlyChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar", // type doesn't matter much since we'll hide axes
      data: {
        labels: ["Dummy"],
        datasets: [
          {
            label: "Purchase",
            data: [0],
            backgroundColor: "purple",
          },
          {
            label: "Revenue",
            data: [0],
            backgroundColor: "orange",
          },
          {
            label: "Expense",
            data: [0],
            backgroundColor: "gray",
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            labels: {
              usePointStyle: true,
              pointStyle: "rect", // solid box
              boxWidth: 20,
              padding: 40,
              
            },
          },
        },
        responsive: true,
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};






const TwoBoxes = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 pt-4 p-4 md:p-0 
    justify-center text-gray-500">
     
      <div className="md:w-[55%]  h-60 md:h-100 bg-white rounded-md shadow-md text-black p-5 relative">
        
          <div className='text-gray-600 font-semibold'>Cash Flow</div>
          <CashFlowChart/>
      </div>

      <div className="md:w-[40%]  h-[450px] bg-white rounded-md shadow-md text-black p-5 relative">
        <div className="absolute top-4 mb-2 left-4 font-semibold text-lg">July 2025</div>
           <LegendOnlyChart  />
     
      </div>
      
    </div>
  );
};

export default TwoBoxes;
