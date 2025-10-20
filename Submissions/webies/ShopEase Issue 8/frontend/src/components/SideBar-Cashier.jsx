import  { useState } from 'react';
import './SideBar.css';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowForward, IoIosClose } from "react-icons/io";

import { BsCart2 } from 'react-icons/bs';

const navItems = [
  {
      label: 'Sale',
      icon: <BsCart2 />,
      sub: [
        { label: 'Sale List', path: '/cashier/sale/list' },
        { label: 'Add Sale', path: '/cashier/sale/add' },
      ],
    },
  
  
];

const Sidebar = ({ isOpen, onCrossClick }) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <aside
      className={`
         fixed top-0 mt-10 left-0 h-[calc(100vh-2rem)]  w-72 overflow-y-auto
        bg-black-200 z-50 p-4 
        transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 shadow-lg
      `}
    >
      <div className="flex w-full justify-end md:hidden">
        <IoIosClose
          onClick={onCrossClick}
          className="text-2xl cursor-pointer absolute mt-2.5"
        />
      </div>

      <ul className="space-y-1 mt-2">
        {navItems.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => {
                if (item.sub) {
                  toggleDropdown(index);
                } else {
                  setOpenDropdown(null); 
                  navigate(item.path);
                  if (onCrossClick) onCrossClick();
                }
              }}
              className={`w-full flex items-center justify-between 
                px-3 py-2 text-gray-800 rounded text-md transition cursor-pointer ${
                openDropdown === index ? 'bg-white' : 'hover:bg-purple-200'
              }`}
            >
              <div className=" flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.sub &&
                (openDropdown === index ? (
                  <IoIosArrowDown className="text-xl text-purple-600" />
                ) : (
                  <IoIosArrowForward className="text-xl text-purple-600" />
                ))}
            </button>

            
            {item.sub && (
              <div
                className={`overflow-hidden transition-all duration-400 bg-white rounded p-2 mt-1 space-y-1 custom-scrollbar ${openDropdown === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 p-0'}`}
                style={{
                  pointerEvents: openDropdown === index ? 'auto' : 'none',
                  overflowY: openDropdown === index ? 'auto' : 'hidden',
                }}
              >
                {item.sub.map((sub, subIdx) => (
                  <p
                    key={subIdx}
                    onClick={() => {
                      navigate(sub.path);
                      if (onCrossClick) onCrossClick();
                    }}
                    className="text-base text-gray-600 cursor-pointer hover:text-purple-700 px-2 py-1 rounded-md transition-all duration-300 
                    ease-in-out transform hover:translate-x-2"
                  >
                    {sub.label}
                  </p>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;