import React, { useState, useRef, useEffect } from 'react';
import { IoPersonOutline, IoEarth } from "react-icons/io5";
import { IoIosNotifications, IoIosMenu } from "react-icons/io";
import { MdOutlineShoppingBag } from "react-icons/md";
import { CiBoxes } from "react-icons/ci";

const Navbar = ({ onMenuClick }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedIn');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="flex items-center justify-between
         px-6 py-3 bg-black-200 
         text-gray-700 w-full shadow-md fixed top-0 z-56">
            
            {/* Hamburger Menu */}
            <div onClick={onMenuClick} className="md:hidden text-2xl hover:text-purple-700 cursor-pointer">
                <IoIosMenu className='text-purple-500' />
            </div>

            {/* Logo */}
            <div className='flex items-center text-xl cursor-pointer gap-1'>
                <CiBoxes className='text-3xl text-purple-500' />
                <span className="font-medium">ShopEase</span>
            </div>

            
           <div className='flex gap-2'>

            {/* Admin Dropdown (icon only for all devices) */}
            <div className="relative" ref={dropdownRef}>
                <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className='flex items-center pl-1 hover:text-purple-700 cursor-pointer transition select-none gap-1'
                >
                    <IoPersonOutline className="text-2xl" />
                    
                    Welcome
                 </div>

                {dropdownOpen && (
                    <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                        
                        <li
                            onClick={() => {
                                handleLogout();
                                setDropdownOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-red-600 transition"
                        >
                            Logout
                        </li>
                    </ul>
                )}
            </div>
            </div>
        </nav>
    );
};

export default Navbar;
