import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './SideBar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen font-[Inter] w-full overflow-x-hidden">
      <div className="">
        <Navbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
      </div>
      
      <div className="flex flex-col md:flex-row">
      
        <Sidebar className=''
          isOpen={isSidebarOpen}
          onCrossClick={() => setIsSidebarOpen(false)}
        />
       
        <main className="flex-1 md:ml-72 pt-15">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;