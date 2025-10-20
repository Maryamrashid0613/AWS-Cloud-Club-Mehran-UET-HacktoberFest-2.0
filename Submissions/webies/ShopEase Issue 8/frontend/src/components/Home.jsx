import React, { useState, useEffect, useRef } from 'react';
import TopBox from './TopBox';
import { FaDollarSign, FaUsers, FaShoppingCart, FaTrophy } from 'react-icons/fa';
import TwoBoxes from './TwoBoxes';
import DashboardWidgets from './DashboardWidgets';
import BottomWidgets from './BottomWidgets';
import { motion } from 'framer-motion';
import * as Chart from 'chart.js';
import { ToastContainer } from 'react-toastify';
const YearlyReportChart = ({ width = "100%", height = "600px" }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart.Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
          {
            label: 'Purchased Amount',
            data: [0, 0, 0, 0, 0, 155000, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#8B5A96',
            borderColor: '#8B5A96',
            borderWidth: 0,
            barThickness: 50,
          },
          {
            label: 'Sold Amount',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#FF8A65',
            borderColor: '#FF8A65',
            borderWidth: 0,
            barThickness: 50,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Yearly Report',
            font: {
              size: 18,
              weight: 'bold'
            },
            color: '#666',
            align: 'start',
            padding: {
              bottom: 30
            }
          },
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'rect',
              padding: 20,
              font: {
                size: 12
              },
              color: '#666'
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: '#e5e5e5',
              drawBorder: false
            },
            ticks: {
              color: '#999',
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: true,
            max: 160000,
            grid: {
              display: true,
              color: '#e5e5e5',
              drawBorder: false
            },
            ticks: {
              color: '#999',
              font: {
                size: 11
              },
              stepSize: 20000,
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          }
        },
        elements: {
          bar: {
            borderRadius: 2
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
    <div 
      className="p-6 bg-white"
      style={{ width, height }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const sectionVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.98  
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const uniformVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,  
    filter: "blur(2px)"  
  },
  visible: { 
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const Home = () => {

     const [loggedIn,setLoggedin]=useState()
    
     useEffect(() => {
      setLoggedin(localStorage.getItem('loggedIn'))
     }, [])
     
  
  return (
    <motion.div 
      className='bg-gray-100 min-h-screen overflow-hidden'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className='pt-5 pl-5'
        variants={uniformVariants}
      >
        <motion.h1 
          className='text-xl font-medium text-purple-600'
          variants={uniformVariants}
        >
          Welcome Mr : {loggedIn}
        </motion.h1>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5"
        variants={gridVariants}
      >
        <motion.div variants={uniformVariants}>
          <TopBox label="Revenue" icon={FaDollarSign} value={80} color="purple" />
        </motion.div>
        <motion.div variants={uniformVariants}>
          <TopBox label="Sale Return" icon={FaUsers} value={20} color="orange" />
        </motion.div>
        <motion.div variants={uniformVariants}>
          <TopBox label="Purchase Return" icon={FaShoppingCart} value={15} color="cornflowerblue" />
        </motion.div>
        <motion.div variants={uniformVariants}>
          <TopBox label="Profit" icon={FaTrophy} value={65} color="magenta" />
        </motion.div>
      </motion.div>

      <motion.div variants={uniformVariants}>
        <TwoBoxes/>
      </motion.div>


      <motion.footer 
        className='mt-4'
        variants={uniformVariants}
      >
        <p className='w-full flex justify-center text-gray-500'>
          POS || designed by Jam Yousuf
        </p>
      </motion.footer>
    </motion.div>
  );
};

export default Home;