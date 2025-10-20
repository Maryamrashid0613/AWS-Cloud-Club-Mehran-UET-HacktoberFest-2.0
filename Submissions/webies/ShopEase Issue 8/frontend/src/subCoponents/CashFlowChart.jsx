import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const CashFlowChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "February", "March", "April", "May", "June", "July", "August"
        ],
        datasets: [
          {
            label: "Payment Received",
            data: [12, 19, 14, 20, 18, 22, 25],
            borderColor: "purple",
            backgroundColor: "transparent",
            borderWidth: 2,
            tension: 0.1,
            pointBackgroundColor: "purple",
            fill: false
          },
          {
            label: "Payment Sent",
            data: [10, 12, 9, 15, 14, 16, 18    ],
            borderColor: "orange",
            backgroundColor: "transparent",
            borderWidth: 2,
            tension: 0.1,
            pointBackgroundColor: "orange",
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default CashFlowChart;
